package ltw.projetltw.Controller;

import lombok.AllArgsConstructor;
import ltw.projetltw.Entity.Vente;
import ltw.projetltw.Services.VenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/vente")
public class VenteController {
    VenteService venteService;

    @GetMapping
    public List<Vente> getAllVentes() {
        return venteService.findAll();
    }

    // 🔹 GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Vente> getVenteById(@PathVariable Integer id) {
        return venteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 CREATE
    @PostMapping
    public Vente createVente(@RequestBody Vente vente) {
        return venteService.add(vente);
    }

    // 🔹 UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Vente> updateVente(@PathVariable Integer id, @RequestBody Vente vente) {
        return venteService.update(id, vente)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVente(@PathVariable Integer id) {
        venteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
