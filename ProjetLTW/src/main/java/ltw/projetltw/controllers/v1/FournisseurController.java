package ltw.projetltw.controllers.v1;

import ltw.projetltw.entities.FournisseurEntity;
import ltw.projetltw.services.v1.FournisseurService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/fournisseurs")
@RequiredArgsConstructor
@Slf4j // For logging
public class FournisseurController {

    private final FournisseurService service;

    /**
     * Endpoint to retrieve all suppliers.
     */
    @GetMapping
    public ResponseEntity<List<FournisseurEntity>> getAllFournisseurs() {
        log.debug("Received request to get all Suppliers");
        return ResponseEntity.ok(service.getAllFournisseurs());
    }

    /**
     * Endpoint to retrieve a supplier by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<FournisseurEntity> getFournisseurById(@PathVariable Integer id) {
        log.debug("Received request to get Supplier by ID: {}", id);
        return ResponseEntity.ok(service.getFournisseurById(id));
    }

    /**
     * Endpoint to create a new supplier.
     */
    @PostMapping()
    public ResponseEntity<FournisseurEntity> createFournisseur(
            @RequestPart("fournisseur") @Valid FournisseurEntity request) {
        log.info("Received request to create new Supplier");
        FournisseurEntity createdEntity = service.createFournisseur(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdEntity);
    }

    /**
     * Endpoint to update an existant supplier.
     */
    @PutMapping("/{id}")
    public ResponseEntity<FournisseurEntity> updateFournisseur(
            @PathVariable Integer id,
            @RequestPart("fournisseur") @Valid FournisseurEntity request) {
        log.info("Received request to update Supplier with ID: {}", id);
        FournisseurEntity updatedEntity = service.updateFournisseur(id, request);
        return ResponseEntity.ok(updatedEntity);
    }

    /**
     * Endpoint to delete a supplier by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFournisseur(@PathVariable Integer id) {
        log.info("Received request to delete Supplier with ID: {}", id);
        service.deleteFournisseur(id);
        return ResponseEntity.noContent().build();
    }
}
