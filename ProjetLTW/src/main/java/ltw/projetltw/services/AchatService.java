package ltw.projetltw.services;

import ltw.projetltw.dtos.responses.AchatResponse;
import ltw.projetltw.dtos.responses.AchatSummaryResponse;
import ltw.projetltw.entities.AchatEntity;
import ltw.projetltw.entities.AchatProduit;
import ltw.projetltw.entities.Fournisseur;
import ltw.projetltw.mappers.AchatMapper;
import ltw.projetltw.mappers.AchatProduitMapper;
import ltw.projetltw.repositories.AchatProduitRepository;
import ltw.projetltw.repositories.AchatRepository;
import ltw.projetltw.repositories.FournisseurRepository; // For the relationship
import ltw.projetltw.dtos.responses.AchatProduitResponse;
import ltw.projetltw.exceptions.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j // For logging
public class AchatService {

    private final AchatRepository repository;
    private final FournisseurRepository fournisseurRepository;
    private final AchatProduitRepository achatProduitRepository;

    private final AchatMapper mapper;
    private final AchatProduitMapper achatProduitMapper;

    @Transactional(readOnly = true)
    public List<AchatSummaryResponse> getAllAchats() {
        // fetch Purchases
        log.debug("Fetching all Purchases");
        return repository.findAllSummary();
    }

    @Transactional(readOnly = true)
    public AchatResponse getAchatResponseById(Integer id) {
        // fetch Purchase
        log.debug("Fetching Purchase with id: {}", id);
        AchatEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found with id: " + id));
        // fetch Products of the Purchase
        log.debug("Fetching Products with id: {}", id);
        List<AchatProduit> products = achatProduitRepository.findByAchatId(id);

        // response
        Set<AchatProduitResponse> produitResponses = products.stream()
                .map(achatProduitMapper::toDto)
                .collect(Collectors.toSet());
        AchatResponse response = mapper.toDto(entity);
        response.setProduits(produitResponses);

        return response;
    }

    @Transactional(readOnly = true)
    public AchatEntity getAchatById(Integer id) {
        // fetch Purchase
        log.debug("Fetching Purchase with id: {}", id);
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found with id: " + id));
    }

    @Transactional
    public AchatEntity createAchat(AchatEntity entity, Integer idFournisseur) {
        log.info("Attempting to create a new Purchase for Supplier ID: {}", idFournisseur);
        Fournisseur fournisseur = fournisseurRepository.findById(idFournisseur)
                .orElseThrow(() -> {
                    log.warn("Supplier not found with id: {}", idFournisseur);
                    return new ResourceNotFoundException("Supplier not found with id: " + idFournisseur);
                });
        entity.setFournisseur(fournisseur);
        AchatEntity savedEntity = repository.save(entity);
        log.info("Purchase created successfully with ID: {}", savedEntity.getId());
        return savedEntity;
    }

    @Transactional
    public AchatEntity updateAchat(Integer id, AchatEntity entity, Integer idFournisseur) {
        log.info("Attempting to update Purchase with ID: {}", id);
        AchatEntity existingEntity = getAchatById(id);

        Optional.ofNullable(entity.getFacture()).ifPresent(existingEntity::setFacture);

        existingEntity.setNumFacture(entity.getNumFacture());
        existingEntity.setDateFacture(entity.getDateFacture());
        existingEntity.setMontantFacture(entity.getMontantFacture());

        if (idFournisseur != null && !idFournisseur.equals(existingEntity.getFournisseur().getId())) {
            Fournisseur newFournisseur = fournisseurRepository.findById(idFournisseur)
                    .orElseThrow(() -> {
                        log.warn("Supplier not found with id: {}", idFournisseur);
                        return new ResourceNotFoundException("Supplier not found with id: " + idFournisseur);
                    });
            existingEntity.setFournisseur(newFournisseur);
            log.debug("Supplier updated for Purchase ID {}: new ID {}", id, idFournisseur);
        }

        AchatEntity updatedAchat = repository.save(existingEntity);
        log.info("Purchase with ID {} updated successfully", updatedAchat.getId());
        return updatedAchat;
    }

    @Transactional
    public void deleteAchat(Integer id) {
        log.info("Attempting to delete Purchase with ID: {}", id);
        AchatEntity entity = getAchatById(id);
        repository.delete(entity);
        log.info("Purchase with ID {} deleted successfully", id);
    }
}