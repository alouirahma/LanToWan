package ltw.projetltw.Services;

import lombok.AllArgsConstructor;
import ltw.projetltw.Entity.Produit;
import ltw.projetltw.Repository.ProduitRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProduitService implements IProduitServ{
    ProduitRepo produitRepo;
    public List<Produit> findAll() {
        return produitRepo.findAll();
    }

    public Produit add(Produit p) {
        return produitRepo.save(p);
    }

    public Optional<Produit> findById(Integer id) {
        return produitRepo.findById(id);
    }

    public void deleteById(Integer id) {
        produitRepo.deleteById(id);
    }
    public Optional<Produit> update(Integer id, Produit newProduit) {
        return produitRepo.findById(id).map(existing -> {
            existing.setRef(newProduit.getRef());
            existing.setNom(newProduit.getNom());
            existing.setQtePhy(newProduit.getQtePhy());
            existing.setQteTheo(newProduit.getQteTheo());
            existing.setPrixUnitaire(newProduit.getPrixUnitaire());
            existing.setComptable(newProduit.getComptable());
            existing.setNumSerie(newProduit.getNumSerie());
            existing.setBareCode(newProduit.getBareCode());
            existing.setCatProd(newProduit.getCatProd());
            existing.setTaxProd(newProduit.getTaxProd());
            return produitRepo.save(existing);
        });
    }
}
