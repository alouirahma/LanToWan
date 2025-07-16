package ltw.projetltw.services.v1;

import ltw.projetltw.dtos.requests.AchatProduitRequest;
import ltw.projetltw.entities.AchatEntity;
import ltw.projetltw.entities.AchatProduitEntity;
import ltw.projetltw.entities.ProduitEntity;
import ltw.projetltw.exceptions.ResourceNotFoundException;
import ltw.projetltw.mappers.AchatProduitMapper;
import ltw.projetltw.repositories.AchatProduitRepository;
import ltw.projetltw.repositories.AchatRepository;
import ltw.projetltw.repositories.ProduitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AchatProduitService {

    private final AchatProduitRepository repository;
    private final ProduitRepository produitRepository; // To fetch Produit
    private final AchatRepository achatRepository; // To fetch Achat

    private final AchatProduitMapper mapper;

    /**
     * Retrieves a list of all product lines of a purchase.
     */
    @Transactional(readOnly = true)
    public List<AchatProduitEntity> getAllAchatProduitEntities(Integer idAchat) {
        log.debug("Fetching all Product Lines of a Purchase with id: {}", idAchat);
        return repository.findByAchatId(idAchat);
    }

    /**
     * Retrieves a product line by ID for internal use.
     */
    @Transactional(readOnly = true)
    public AchatProduitEntity getAchatProduitEntityById(Integer id) {
        log.debug("Fetching Product Line with id: {}", id);
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product Line not found with id: " + id));
    }


    /**
     * Creates a new product line for a purchase.
     */
    @Transactional
    public AchatProduitEntity createAchatProduitEntity(AchatProduitRequest request, Integer idProduit, Integer idAchat) {
        log.info("Attempting to create Product Line for Product ID: {} and Purchase ID: {}", idProduit, idAchat);
        AchatProduitEntity entity = mapper.toEntity(request);

        ProduitEntity produit = verifyProductEntity(idProduit);
        AchatEntity achat = verifyPurchaseEntity(idAchat);

        entity.setProduit(produit);
        entity.setAchat(achat);

        AchatProduitEntity savedAchatProduit = repository.save(entity);
        log.info("Product Line created successfully with ID: {}", savedAchatProduit.getId());
        return savedAchatProduit;
    }

    /**
     * Creates new product lines for a purchase.
     */
    @Transactional
    public void createAchatProduitEntities(List<AchatProduitRequest> request, AchatEntity achatEntity) {
        log.info("Attempting to create Product Lines for a Purchase ID: {}", achatEntity.getId());

        List<AchatProduitEntity> entities = request.stream()
                .map(achatProduitRequest -> {
                    AchatProduitEntity achatProduitEntity = mapper.toEntity(achatProduitRequest);

                    Integer idProduit = achatProduitRequest.getIdProduit();
                    ProduitEntity produitEntity = verifyProductEntity(idProduit);

                    achatProduitEntity.setProduit(produitEntity);
                    achatProduitEntity.setAchat(achatEntity);
                    return achatProduitEntity;
                })
                .collect(Collectors.toList());

        List<AchatProduitEntity> savedEntities = repository.saveAll(entities);
        log.info("All the Product Lines are created successfully");
    }

    /**
     * Updates an existing product line.
     */
    @Transactional
    public AchatProduitEntity updateAchatProduitEntity(Integer id, AchatProduitRequest request, Integer idProduit,
                                                       Integer idAchat) {
        log.info("Attempting to update Product Line with ID: {}", id);
        AchatProduitEntity existingEntity = getAchatProduitEntityById(id);

        ProduitEntity produit = verifyProductEntity(idProduit);
        AchatEntity achat = verifyPurchaseEntity(idAchat);

        mapper.updateEntityFromDto(request, existingEntity);

        AchatProduitEntity updatedEntity = repository.save(existingEntity);
        log.info("Product Line with ID {} updated successfully", updatedEntity.getId());
        return updatedEntity;
    }

    /**
     * Updates an existing product lines.
     */
    @Transactional
    public void updateAchatProduitEntities(AchatProduitRequest request, AchatEntity achatEntity) {
        log.info("Attempting to update Product Lines with ID: {}", achatEntity.getId());

    }

    /**
     * Deletes a purchase line by ID.
     */
    @Transactional
    public void deleteAchatProduitEntity(Integer id) {
        log.info("Attempting to delete Product Line with ID: {}", id);
        AchatProduitEntity entity = getAchatProduitEntityById(id);
        repository.delete(entity);
        log.info("Product Line with ID {} deleted successfully", id);
    }

    public AchatEntity verifyPurchaseEntity(Integer idAchat) {
        return achatRepository.findById(idAchat)
                .orElseThrow(() -> {
                    log.warn("Purchase not found with id: {}", idAchat);
                    return new ResourceNotFoundException("Purchase not found with id: " + idAchat);
                });
    }

    public ProduitEntity verifyProductEntity(Integer idProduit) {
        return produitRepository.findById(idProduit)
                .orElseThrow(() -> {
                    log.warn("Product not found with id: {}", idProduit);
                    return new ResourceNotFoundException("Product not found with id: " + idProduit);
                });
    }
}