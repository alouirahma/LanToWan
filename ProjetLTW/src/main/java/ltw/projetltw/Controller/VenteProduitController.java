package ltw.projetltw.Controller;

import lombok.AllArgsConstructor;
import ltw.projetltw.Entity.VenteProduit;
import ltw.projetltw.Services.VenteProduitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/venteproduit")

public class VenteProduitController {
    VenteProduitService venteProduitService;

    @GetMapping
    public List<VenteProduit> getAllVenteProduits() {
        return venteProduitService.findAll();
    }


    @GetMapping("/{id}")
    public ResponseEntity<VenteProduit> getById(@PathVariable Integer id) {
        return venteProduitService.findByID(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public VenteProduit create(@RequestBody VenteProduit vp) {
        return venteProduitService.add(vp);
    }


    @PutMapping("/{id}")
    public ResponseEntity<VenteProduit> update(@PathVariable Integer id, @RequestBody VenteProduit vp) {
        return venteProduitService.update(id, vp)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Integer id) {
        return venteProduitService.findByID(id)
                .map(venteProduit -> {
                    venteProduitService.delete(venteProduit);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }




}

