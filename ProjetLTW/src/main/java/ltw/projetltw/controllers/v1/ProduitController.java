package ltw.projetltw.controllers.v1;

import ltw.projetltw.dtos.requests.ProduitRequest;
import ltw.projetltw.entities.ProduitEntity;
import ltw.projetltw.services.v1.ProduitService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
@Slf4j // For logging
public class ProduitController {
    private final ProduitService service;

    /**
     * Endpoint to retrieve all products.
     */
    @GetMapping
    public ResponseEntity<List<ProduitEntity>> getAllProduitEntities() {
        log.debug("Received request to get all Products");
        return ResponseEntity.ok(service.getAllProduitEntities());
    }

    /**
     * Endpoint to retrieve a products by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProduitEntity> getProduitEntityById(@PathVariable Integer id) {
        log.debug("Received request to get Product by ID: {}", id);
        return ResponseEntity.ok(service.getProduitEntityById(id));
    }

    /**
     * Endpoint to create a new product.
     */
    @PostMapping()
    public ResponseEntity<ProduitEntity> createProduitEntity(
            @RequestPart("produit") @Valid ProduitRequest request) {
        log.info("Received request to create new Product");
        ProduitEntity createdEntity = service.createProduitEntity(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEntity);
    }

    /**
     * Endpoint to update an existant product.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProduitEntity> updateProduitEntity(
            @PathVariable Integer id,
            @RequestPart("produit") @Valid ProduitRequest request) {
        log.info("Received request to update Product with ID: {}", id);
        ProduitEntity updatedEntity = service.updateProduitEntity(id, request);
        return ResponseEntity.ok(updatedEntity);
    }

    /**
     * Endpoint to delete a product by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduitEntity(@PathVariable Integer id) {
        log.info("Received request to delete Product with ID: {}", id);
        service.deleteProduitEntity(id);
        return ResponseEntity.noContent().build();
    }
}
