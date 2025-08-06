package ltw.projetltw.Services;

import lombok.AllArgsConstructor;
import ltw.projetltw.Entity.Fournisseur;
import ltw.projetltw.Repository.FournisseurRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class FournisseurService implements IFournisseurServ {
    FournisseurRepo fournisseurRepo;

    public List<Fournisseur> findAll() {
        return fournisseurRepo.findAll();
    }

    public Fournisseur add(Fournisseur fournisseur) {
        return fournisseurRepo.save(fournisseur);
    }

    public Optional<Fournisseur> findById(Integer id) {
        return fournisseurRepo.findById(id);
    }

    public void deleteById(Integer id) {
        fournisseurRepo.deleteById(id);
    }

    public Optional<Fournisseur> update(Integer id, Fournisseur updatedFournisseur) {
        return fournisseurRepo.findById(id).map(existing -> {
            existing.setNom(updatedFournisseur.getNom());
            existing.setEmail(updatedFournisseur.getEmail());
            existing.setAdresse(updatedFournisseur.getAdresse());
            existing.setTelephone(updatedFournisseur.getTelephone());
            existing.setMatriculeFiscaleF(updatedFournisseur.getMatriculeFiscaleF());
            return fournisseurRepo.save(existing);
        });
    }
}
