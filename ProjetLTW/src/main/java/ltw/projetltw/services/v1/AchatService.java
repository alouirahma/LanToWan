package ltw.projetltw.services.v1;

import ltw.projetltw.entities.AchatEntity;
import ltw.projetltw.entities.AchatProduitEntity;
import ltw.projetltw.entities.FournisseurEntity;
import ltw.projetltw.exceptions.ResourceNotFoundException;
import ltw.projetltw.dtos.requests.AchatRequest;
import ltw.projetltw.dtos.responses.AchatProduitResponse;
import ltw.projetltw.dtos.responses.AchatResponse;
import ltw.projetltw.dtos.responses.AchatSummaryResponse;
import ltw.projetltw.repositories.AchatProduitRepository;
import ltw.projetltw.repositories.AchatRepository;
import ltw.projetltw.repositories.FournisseurRepository;
import ltw.projetltw.mappers.AchatMapper;
import ltw.projetltw.mappers.AchatProduitMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j // For logging
public class AchatService {

    private final AchatRepository repository;
    private final FournisseurRepository fournisseurRepository;
    private final AchatProduitRepository achatProduitRepository;

    private final AchatProduitService achatProduitService;

    private final AchatMapper mapper;
    private final AchatProduitMapper achatProduitMapper;

    @Value("${document.storage.path}")
    private String documentStoragePath; // Configurable base path for documents

    /**
     * Retrieves a list of all purchases summarised.
     */
    @Transactional(readOnly = true)
    public List<AchatSummaryResponse> getAllAchatEntities() {
        log.debug("Fetching all Purchases");
        return repository.findAllSummary();
    }

    /**
     * Retrieves a purchase by ID, including associated products, as a detailed response.
     */
    @Transactional(readOnly = true)
    public AchatResponse getAchatResponseById(Integer id) {
        log.debug("Fetching Purchase with id: {}", id);
        AchatEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found with id: " + id));

        log.debug("Fetching Products with id: {}", id);
        List<AchatProduitEntity> achatProduitEntities = achatProduitRepository.findByAchatId(id);

        Set<AchatProduitResponse> produitResponses = achatProduitEntities.stream()
                .map(achatProduitMapper::toDto)
                .collect(Collectors.toSet());
        AchatResponse response = mapper.toDto(entity);
        response.setProduits(produitResponses);
        return response;
    }

    /**
     * Retrieves a purchase entity by ID for internal use.
     */
    @Transactional(readOnly = true)
    public AchatEntity getAchatEntityById(Integer id) {
        log.debug("Fetching Purchase with id: {}", id);
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found with id: " + id));
    }

    /**
     * Creates a new purchase with an optional document upload.
     */
    @Transactional
    public AchatEntity createAchatEntity(AchatRequest request, MultipartFile documentFile) throws IOException {
        log.info("Attempting to create a new Purchase for Supplier ID: {}", request.getIdDestinateur());
        AchatEntity entity = mapper.toEntity(request);

        // Handle supplier
        FournisseurEntity fournisseur = fournisseurRepository.findById(request.getIdDestinateur())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + request.getIdDestinateur()));
        entity.setFournisseur(fournisseur);

        // Handle document
        if (documentFile != null && !documentFile.isEmpty()) {
            String documentPath = saveDocument(documentFile, entity);
            entity.setDocument(documentPath);
        }

        AchatEntity savedEntity = repository.save(entity);
        log.info("Purchase created successfully with ID: {}", savedEntity.getId());

        // Handle product lines
        achatProduitService.createAchatProduitEntities(request.getProduits(), savedEntity);

        return savedEntity;
    }

    /**
     * Updates an existing purchase with an optional document upload.
     */
    @Transactional
    public AchatEntity updateAchatEntity(Integer id, AchatRequest request, MultipartFile documentFile) throws IOException {
        log.info("Attempting to update Purchase with ID: {}", id);
        AchatEntity existingEntity = getAchatEntityById(id);

        mapper.updateEntityFromDto(request, existingEntity);

        // Handle supplier update
        if (request.getIdDestinateur() != null && !request.getIdDestinateur().equals(existingEntity.getFournisseur().getId())) {
            FournisseurEntity newFournisseur = fournisseurRepository.findById(request.getIdDestinateur())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + request.getIdDestinateur()));
            existingEntity.setFournisseur(newFournisseur);
            log.debug("Supplier updated for Purchase ID {}: new ID {}", id, request.getIdDestinateur());
        }

        // Handle document update
        if (documentFile != null && !documentFile.isEmpty()) {
            // Delete old document if exists
            if (existingEntity.getDocument() != null) {
                deleteDocument(existingEntity.getDocument());
            }
            String newDocumentPath = saveDocument(documentFile, existingEntity);
            existingEntity.setDocument(newDocumentPath);
        } else if (documentFile == null && request.getDeleteDocument()) {
            // If deleteDocument is set to true, remove the existing document
            deleteDocument(existingEntity.getDocument());
            existingEntity.setDocument(null);
        }

        AchatEntity updatedEntity = repository.save(existingEntity);
        log.info("Purchase with ID {} updated successfully", updatedEntity.getId());

        // Handle product lines update
        List<AchatProduitEntity> achatProduitEntities = achatProduitService.getAllAchatProduitEntities(updatedEntity.getId());
        for (AchatProduitEntity achatProduitEntity : achatProduitEntities) {
            achatProduitService.deleteAchatProduitEntity(achatProduitEntity.getId());
        }
        achatProduitService.createAchatProduitEntities(request.getProduits(), updatedEntity);

        return updatedEntity;
    }

    /**
     * Deletes a purchase by ID and removes the associated document if exists.
     */
    @Transactional
    public void deleteAchatEntity(Integer id) {
        log.info("Attempting to delete Purchase with ID: {}", id);
        AchatEntity entity = getAchatEntityById(id);

        // Handle document delete
        if (entity.getDocument() != null) {
            deleteDocument(entity.getDocument());
        }

        // Handle product lines delete
        List<AchatProduitEntity> achatProduitEntities = achatProduitService.getAllAchatProduitEntities(entity.getId());
        for (AchatProduitEntity achatProduitEntity : achatProduitEntities) {
            achatProduitService.deleteAchatProduitEntity(achatProduitEntity.getId());
        }
        repository.delete(entity);
        log.info("Purchase with ID {} deleted successfully", id);
    }

    /**
     * Saves the document to the appropriate directory structure.
     */
    private String saveDocument(MultipartFile file, AchatEntity entity) throws IOException {
        String year = entity.getDate().format(DateTimeFormatter.ofPattern("yyyy"));
        String month = entity.getDate().format(DateTimeFormatter.ofPattern("MMMM")); // Full month name
        String supplierName = entity.getFournisseur().getNom();

        Path directoryPath = Paths.get(documentStoragePath, year, supplierName, month);
        Files.createDirectories(directoryPath); // Create directories if they don't exist

        String fileName = file.getOriginalFilename();
        Path filePath = directoryPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        return filePath.toString(); // Store the full path or relative path as needed
    }

    /**
     * Deletes the document from the file system.
     */
    private void deleteDocument(String documentPath) {
        try {
            Path path = Paths.get(documentPath);
            Files.deleteIfExists(path);
            log.debug("Document deleted: {}", documentPath);
        } catch (IOException e) {
            log.error("Failed to delete document: {}", documentPath, e);
        }
    }
}