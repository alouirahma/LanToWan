package ltw.projetltw.Services;

import ltw.projetltw.Entity.VenteProduit;

import java.util.List;
import java.util.Optional;

public interface IVenteProduitServ {
    List<VenteProduit> findAll();
    VenteProduit add(VenteProduit venteProduit);
    Optional <VenteProduit> update(Integer id,VenteProduit venteProduit);
    void delete(VenteProduit venteProduit);
    Optional<VenteProduit> findByID(Integer id);
}
