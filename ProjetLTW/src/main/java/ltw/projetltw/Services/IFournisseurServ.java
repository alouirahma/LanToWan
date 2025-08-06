package ltw.projetltw.Services;

import ltw.projetltw.Entity.Client;
import ltw.projetltw.Entity.Fournisseur;

import java.util.List;
import java.util.Optional;

public interface IFournisseurServ {
    List<Fournisseur> findAll();
    Fournisseur add(Fournisseur fournisseur);
    Optional<Fournisseur> findById(Integer id);
    void deleteById(Integer id);
    Optional<Fournisseur> update(Integer id, Fournisseur updatedFournisseur);
}
