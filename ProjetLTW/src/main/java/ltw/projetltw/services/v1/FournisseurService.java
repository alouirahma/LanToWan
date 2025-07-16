package ltw.projetltw.services.v1;

import ltw.projetltw.entities.FournisseurEntity;
import ltw.projetltw.exceptions.ResourceNotFoundException;
import ltw.projetltw.repositories.FournisseurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j // For logging
public class FournisseurService {
    private final FournisseurRepository repository;

    /**
     * Retrieves a list of all suppliers.
     */
    @Transactional(readOnly = true)
    public List<FournisseurEntity> getAllFournisseurs() {
        log.debug("Fetching all Suppliers");
        return repository.findAll();
    }

    /**
     * Retrieves a supplier entity by ID.
     */
    @Transactional(readOnly = true)
    public FournisseurEntity getFournisseurById(Integer id) {
        log.debug("Fetching Supplier with id: {}", id);
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
    }

    /**
     * Creates a new supplier.
     */
    @Transactional
    public FournisseurEntity createFournisseur(FournisseurEntity request) {
        log.info("Attempting to create a new Supplier: {}", request.getId());

        FournisseurEntity savedEntity = repository.save(request);
        log.info("Supplier created successfully with ID: {}", savedEntity.getId());
        return savedEntity;
    }

    /**
     * Updates an existing supplier.
     */
    @Transactional
    public FournisseurEntity updateFournisseur(Integer id, FournisseurEntity request) {
        log.info("Attempting to update Supplier with ID: {}", id);
        FournisseurEntity existingEntity = getFournisseurById(id);

        existingEntity.setNom(request.getNom());
        existingEntity.setAdresse(request.getAdresse());
        existingEntity.setEmail(request.getEmail());
        existingEntity.setTelephone(request.getTelephone());
        existingEntity.setMatriculeFiscaleF(request.getMatriculeFiscaleF());

        FournisseurEntity updatedEntity = repository.save(existingEntity);
        log.info("Supplier with ID {} updated successfully", updatedEntity.getId());
        return updatedEntity;
    }

    /**
     * Deletes a supplier by ID.
     */
    @Transactional
    public void deleteFournisseur(Integer id) {
        log.info("Attempting to delete Supplier with ID: {}", id);
        FournisseurEntity entity = getFournisseurById(id);

        repository.delete(entity);
        log.info("Supplier with ID {} deleted successfully", id);
    }

}
