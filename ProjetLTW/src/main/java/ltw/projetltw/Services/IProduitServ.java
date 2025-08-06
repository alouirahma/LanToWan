package ltw.projetltw.Services;

import ltw.projetltw.Entity.Produit;

import java.util.List;
import java.util.Optional;

public interface IProduitServ {
    List<Produit> findAll();
    Produit add(Produit p);
    Optional<Produit> findById(Integer id);
    void deleteById(Integer id);
    Optional<Produit> update(Integer id, Produit newProduit);
}
