package ltw.projetltw.Services;

import lombok.AllArgsConstructor;
import ltw.projetltw.Entity.Produit;
import ltw.projetltw.Entity.Vente;
import ltw.projetltw.Entity.VenteProduit;
import ltw.projetltw.Repository.ProduitRepo;
import ltw.projetltw.Repository.VenteProduitRepo;
import ltw.projetltw.Repository.VenteRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class VenteProduitService implements IVenteProduitServ{
    VenteProduitRepo venteProduitRepo;
    ProduitRepo produitRepo;
    VenteRepo venteRepo;

    public List<VenteProduit> findAll() {
       return venteProduitRepo.findAll();
    }

    public VenteProduit add(VenteProduit venteProduit) {
        // Récupérer le produit par ID
        Produit produit = produitRepo.findById(venteProduit.getProduit().getId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id " + venteProduit.getProduit().getId()));

        // Récupérer la vente par ID
        Vente vente = venteRepo.findById(venteProduit.getVente().getId())
                .orElseThrow(() -> new RuntimeException("Vente non trouvée avec l'id " + venteProduit.getVente().getId()));

        venteProduit.setProduit(produit);
        venteProduit.setVente(vente);

        return venteProduitRepo.save(venteProduit);
    }


    public Optional<VenteProduit> update(Integer id, VenteProduit newventeProduit) {
        return venteProduitRepo.findById(id).map(existing -> {
            existing.setPrixUnitaire(newventeProduit.getPrixUnitaire());
            existing.setQuantite(newventeProduit.getQuantite());
            existing.setPrixUnitaire(newventeProduit.getPrixUnitaire());
            existing.setTotal(newventeProduit.getTotal());
            existing.setVente(newventeProduit.getVente());
            existing.setProduit(newventeProduit.getProduit());
            existing.setTva(newventeProduit.getTva());
            existing.setRemise(newventeProduit.getRemise());
            return venteProduitRepo.save(existing);
        });
    }

    public void delete(VenteProduit venteProduit) {
        venteProduitRepo.deleteById(venteProduit.getId());
    }

    public Optional<VenteProduit> findByID(Integer id) {
        return venteProduitRepo.findById(id);
    }

}
