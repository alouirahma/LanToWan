package ltw.projetltw.controllers.v1;

import ltw.projetltw.dtos.requests.AchatRequest;
import ltw.projetltw.dtos.responses.AchatResponse;
import ltw.projetltw.dtos.responses.AchatSummaryResponse;
import ltw.projetltw.entities.AchatEntity;
import ltw.projetltw.mappers.AchatMapper;
import ltw.projetltw.services.v1.AchatProduitService;
import ltw.projetltw.services.v1.AchatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/achats")
@RequiredArgsConstructor
@Slf4j // For logging
public class AchatController {

    private final AchatService service;
    private final AchatProduitService achatProduitService;

    private final AchatMapper mapper;

    /**
     * Endpoint to retrieve all purchases as summary responses.
     */
    @GetMapping
    public ResponseEntity<List<AchatSummaryResponse>> getAllAchatEntities() {
        log.debug("Received request to get all Purchases");
        return ResponseEntity.ok(service.getAllAchatEntities());
    }

    /**
     * Endpoint to retrieve a Purchase by ID as a detailed response.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AchatResponse> getAchatResponseById(@PathVariable Integer id) {
        log.debug("Received request to get achat by ID: {}", id);
        return ResponseEntity.ok(service.getAchatResponseById(id));
    }

    /**
     * Endpoint to create a new purchase.
     */
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<AchatSummaryResponse> createAchatSummaryResponse(
            @RequestPart("achat") @Valid AchatRequest request,
            @RequestPart(value = "document", required = false) MultipartFile documentFile) throws IOException {
        log.info("Received request to create new Purchase from Supplier ID: {}", request.getIdDestinateur());
        AchatEntity createdEntity = service.createAchatEntity(request, documentFile);

        AchatSummaryResponse summaryResponse = mapper.toSummaryDto(createdEntity);
        return ResponseEntity.status(HttpStatus.CREATED).body(summaryResponse);
    }

    /**
     * Endpoint to update an existant purchase.
     */
    @PutMapping(path = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<AchatSummaryResponse> updateAchatSummaryResponse(
            @PathVariable Integer id,
            @RequestPart("achat") @Valid AchatRequest request,
            @RequestPart(value = "document", required = false) MultipartFile documentFile) throws IOException {
        log.info("Received request to update Purchase with ID: {}", id);
        AchatEntity updatedEntity = service.updateAchatEntity(id, request, documentFile);
        AchatSummaryResponse summaryResponse = mapper.toSummaryDto(updatedEntity);
        return ResponseEntity.status(HttpStatus.OK).body(summaryResponse);
    }

    /**
     * Endpoint to delete a purchase by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAchatEntity(@PathVariable Integer id) {
        log.info("Received request to delete Purchase with ID: {}", id);
        service.deleteAchatEntity(id);
        return ResponseEntity.noContent().build();
    }
}