package ltw.projetltw.controllers;

import ltw.projetltw.dtos.requests.AchatProduitRequest;
import ltw.projetltw.dtos.responses.AchatProduitResponse;
import ltw.projetltw.entities.AchatProduit;
import ltw.projetltw.mappers.AchatProduitMapper;
import ltw.projetltw.services.AchatProduitService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/achatproduits")
@RequiredArgsConstructor
@Slf4j
public class AchatProduitController {

    private final AchatProduitService service;
    private final AchatProduitMapper mapper;

    // useless
    // @GetMapping
    // public ResponseEntity<List<AchatProduitResponse>> getAllAchatProduits() {
    //     log.debug("Received request to get all Product Lines");
    //     List<AchatProduit> achatProduits = service.getAllAchatProduits();
    //     List<AchatProduitResponse> responses = achatProduits.stream()
    //             .map(mapper::toDto)
    //             .collect(Collectors.toList());
    //     return ResponseEntity.ok(responses);
    // }

    @GetMapping("/{id}")
    public ResponseEntity<AchatProduitResponse> getAchatProduitById(@PathVariable Integer id) {
        log.debug("Received request to get Product Line by ID: {}", id);
        AchatProduit achatProduit = service.getAchatProduitById(id);
        return ResponseEntity.ok(mapper.toDto(achatProduit));
    }

    @PostMapping
    public ResponseEntity<AchatProduitResponse> createAchatProduit(@Valid @RequestBody AchatProduitRequest request) {
        log.info("Received request to create new Product Line for Achat ID: {} and Product ID: {}", request.getIdAchat(), request.getIdProduit());
        AchatProduit entity = mapper.toEntity(request);
        AchatProduit createdAchatProduit = service.createAchatProduit(entity, request.getIdProduit(), request.getIdAchat());
        return new ResponseEntity<>(mapper.toDto(createdAchatProduit), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AchatProduitResponse> updateAchatProduit(@PathVariable Integer id, @Valid @RequestBody AchatProduitRequest request) {
        log.info("Received request to update Product Line with ID: {}", id);
        AchatProduit achatProduitDetails = mapper.toEntity(request); // Use mapper for basic field transfer
        AchatProduit updatedAchatProduit = service.updateAchatProduit(id, achatProduitDetails, request.getIdProduit(), request.getIdAchat());
        return ResponseEntity.ok(mapper.toDto(updatedAchatProduit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAchatProduit(@PathVariable Integer id) {
        log.info("Received request to delete Product Line with ID: {}", id);
        service.deleteAchatProduit(id);
        return ResponseEntity.noContent().build();
    }

    // Optional: Get all AchatProduits for a specific Achat
    @GetMapping("/by-achat/{achatId}")
    public ResponseEntity<List<AchatProduitResponse>> getAchatProduitsByAchatId(@PathVariable Integer achatId) {
        log.debug("Received request to get AchatProduits for Achat ID: {}", achatId);
        List<AchatProduit> achatProduits = service.getAchatProduitsByAchatId(achatId);
        List<AchatProduitResponse> responses = achatProduits.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}