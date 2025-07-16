package ltw.projetltw.services.v1;

import ltw.projetltw.dtos.requests.ProduitRequest;
import ltw.projetltw.entities.ProduitEntity;
import ltw.projetltw.exceptions.ResourceNotFoundException;
import ltw.projetltw.mappers.ProduitMapper;
import ltw.projetltw.repositories.AchatProduitRepository;
import ltw.projetltw.repositories.ProduitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j // For logging
public class ProduitService {

    private final ProduitRepository repository;
    private final AchatProduitRepository achatProduitRepository;

    private final ProduitMapper mapper;

    /**
     * Retrieves a list of all products.
     */
    @Transactional(readOnly = true)
    public List<ProduitEntity> getAllProduitEntities() {
        log.debug("Fetching all Products");
        return repository.findAll();
    }

    /**
     * Retrieves a product entity by ID.
     */
    @Transactional(readOnly = true)
    public ProduitEntity getProduitEntityById(Integer id) {
        log.debug("Fetching Product with id: {}", id);
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    /**
     * Creates a new product.
     */
    @Transactional
    public ProduitEntity createProduitEntity(ProduitRequest request) {
        log.info("Attempting to create a new Product: {}", request.getId());
        ProduitEntity entity=mapper.toEntity(request);

        ProduitEntity savedEntity = repository.save(entity);
        log.info("Product created successfully with ID: {}", savedEntity.getId());
        return savedEntity;
    }

    /**
     * Updates an existing product.
     */
    @Transactional
    public ProduitEntity updateProduitEntity(Integer id, ProduitRequest request) {
        log.info("Attempting to update Product with ID: {}", id);
        ProduitEntity existingEntity = getProduitEntityById(id);

        mapper.updateEntityFromDto(request, existingEntity);

        ProduitEntity updatedEntity = repository.save(existingEntity);
        log.info("Product with ID {} updated successfully", updatedEntity.getId());
        return updatedEntity;
    }

    /**
     * Deletes a product by ID.
     */
    @Transactional
    public void deleteProduitEntity(Integer id) {
        log.info("Attempting to delete Product with ID: {}", id);
        boolean exists = achatProduitRepository.existsByProduitId(id);

        if (exists) return;

        ProduitEntity entity = getProduitEntityById(id);

        repository.delete(entity);
        log.info("Product with ID {} deleted successfully", id);
    }

}
