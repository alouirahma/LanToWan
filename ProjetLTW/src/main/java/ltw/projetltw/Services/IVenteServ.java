package ltw.projetltw.Services;

import ltw.projetltw.Entity.Vente;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IVenteServ {
    List<Vente> findAll();
    Vente add(Vente vente, MultipartFile documentFile);
    Optional<Vente> findById(Integer id);
    void deleteById(Integer id);
    Optional<Vente> update(Integer id, Vente updatedVente, MultipartFile documentFile);
}