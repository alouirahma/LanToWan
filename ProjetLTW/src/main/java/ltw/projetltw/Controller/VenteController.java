package ltw.projetltw.Controller;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import ltw.projetltw.Entity.Vente;
import ltw.projetltw.Services.VenteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/vente")
public class VenteController {
    private final VenteService venteService;

    @GetMapping
    public List<Vente> getAllVentes() {
        return venteService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vente> getVenteById(@PathVariable Integer id) {
        return venteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<Vente> createVente(@RequestBody Vente vente) {
        System.out.println("Received vente object: " + vente);
        if (vente.getVenteProduits() == null || vente.getVenteProduits().isEmpty()) {
            System.out.println("Aucun produit associé à la vente.");
        }
        Vente savedVente = venteService.add(vente, null);
        return ResponseEntity.ok(savedVente);
    }
    @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<Vente> updateVente(@PathVariable Integer id, @RequestBody Vente vente) {
        return venteService.update(id, vente, null) // Pas de fichier pour l'instant
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVente(@PathVariable Integer id) {
        try {
            venteService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}