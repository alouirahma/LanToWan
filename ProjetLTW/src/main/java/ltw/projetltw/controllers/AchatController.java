package ltw.projetltw.controllers;

import ltw.projetltw.dtos.requests.AchatRequest;
import ltw.projetltw.dtos.responses.AchatResponse;
import ltw.projetltw.dtos.responses.AchatSummaryResponse;
import ltw.projetltw.entities.AchatEntity;
import ltw.projetltw.mappers.AchatMapper;
import ltw.projetltw.services.AchatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/achats")
@RequiredArgsConstructor
@Slf4j // For logging
public class AchatController {

    private final AchatService service;
    
    private final AchatMapper mapper;

    @GetMapping
    public ResponseEntity<List<AchatSummaryResponse>> getAllAchats() {
        log.debug("Received request to get all achats");
        return ResponseEntity.ok(service.getAllAchats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AchatResponse> getAchatById(@PathVariable Integer id) {
        log.debug("Received request to get achat by ID: {}", id);
        return ResponseEntity.ok(service.getAchatResponseById(id));
    }

    @PostMapping(consumes = { "application/json", "multipart/form-data" }) 
    public ResponseEntity<AchatSummaryResponse> createAchat(
            @RequestPart("achat") @Valid AchatRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) { 

        log.info("Received request to create new Purchase from Supplier ID: {}", request.getIdFournisseur());

        // adding file to request
        try {
            if (file != null && !file.isEmpty()) {
                request.setFacture(file.getBytes());
                log.debug("Invoice file received for new Purchase: {}", file.getOriginalFilename());
            }
        } catch (IOException e) {
            log.error("Error reading invoice file for new Purchase: {}", e.getMessage());
            throw new IllegalArgumentException("Could not read invoice file: " + e.getMessage());
        }

        // creating entity
        AchatEntity entity = mapper.toEntity(request);
        AchatEntity createdEntity = service.createAchat(entity, request.getIdFournisseur());
        AchatSummaryResponse summaryResponse = mapper.toSummaryDto(createdEntity);
        return ResponseEntity.status(HttpStatus.CREATED).body(summaryResponse);
    }

    @PutMapping(path = "/{id}", consumes = { "application/json", "multipart/form-data" })
    public ResponseEntity<AchatResponse> updateAchat(
            @PathVariable Integer id,
            @RequestPart("achat") @Valid AchatRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        log.info("Received request to update Purchase with ID: {}", id);

        // check if the a new file is uploaded
        try {
            if (file != null && !file.isEmpty()) {
                request.setFacture(file.getBytes());
                log.debug("Invoice file received for updating Purchase ID: {}", id);
            }
        } catch (IOException e) {
            log.error("Error reading invoice file for Purchase update: {}", e.getMessage());
            throw new IllegalArgumentException("Could not read invoice file: " + e.getMessage());
        }

        // convert request data into entity
        AchatEntity entity = mapper.toEntity(request); 

        AchatEntity updatedEntity = service.updateAchat(id, entity, request.getIdFournisseur());
        return ResponseEntity.ok(mapper.toDto(updatedEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAchat(@PathVariable Integer id) {
        log.info("Received request to delete Purchase with ID: {}", id);
        service.deleteAchat(id);
        return ResponseEntity.noContent().build();
    }
}