package ltw.projetltw.Services;

import ltw.projetltw.Entity.Fournisseur;
import ltw.projetltw.Entity.Vente;

import java.util.List;
import java.util.Optional;

public interface IVenteServ {
    List<Vente> findAll();
    Vente add(Vente vente);
    Optional<Vente> findById(Integer id);
    void deleteById(Integer id);
    Optional<Vente> update(Integer id, Vente updatedVente);
}
