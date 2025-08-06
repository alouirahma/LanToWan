package ltw.projetltw.Services;

import lombok.AllArgsConstructor;
import ltw.projetltw.Entity.Client;
import ltw.projetltw.Entity.Vente;
import ltw.projetltw.Repository.ClientRepo;
import ltw.projetltw.Repository.VenteRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class VenteService implements IVenteServ {
    VenteRepo venteRepo;
    ClientRepo clientRepo;


    public List<Vente> findAll() {
        return venteRepo.findAll();
    }

    public Vente add(Vente vente) {
        if (vente.getClient() != null) {
            Client clientExistant = null;

            if (vente.getClient().getId() != null && vente.getClient().getId() != 0) {
                clientExistant = clientRepo.findById(vente.getClient().getId())
                        .orElseThrow(() -> new RuntimeException("Client non trouvé avec ID " + vente.getClient().getId()));
            } else if (vente.getClient().getMatriculeFiscaleC() != null && !vente.getClient().getMatriculeFiscaleC().isEmpty()) {
                clientExistant = clientRepo.findByMatriculeFiscaleC(vente.getClient().getMatriculeFiscaleC())
                        .orElseThrow(() -> new RuntimeException("Client non trouvé avec le matricule : " + vente.getClient().getMatriculeFiscaleC()));
            } else {
                throw new RuntimeException("Client invalide : aucun ID ou matricule fourni.");
            }

            vente.setClient(clientExistant);
        } else {
            throw new RuntimeException("Aucun client fourni.");
        }

        return venteRepo.save(vente);
    }



    public Optional<Vente> findById(Integer id) {
        return venteRepo.findById(id);
    }

    public void deleteById(Integer id) {
        venteRepo.deleteById(id);
    }

    public Optional<Vente> update(Integer id, Vente updatedVente) {
        return venteRepo.findById(id).map(existing -> {
            existing.setNumeroVente(updatedVente.getNumeroVente());
            existing.setFacture(updatedVente.getFacture());
            existing.setModePaiment(updatedVente.getModePaiment());
            existing.setMontantTotal(updatedVente.getMontantTotal());
            existing.setDocumentPaiement(updatedVente.getDocumentPaiement());
            existing.setDinardTimbre(updatedVente.getDinardTimbre());
            existing.setDateCreation(updatedVente.getDateCreation());
            existing.setDateModification(updatedVente.getDateModification());
            existing.setClient(updatedVente.getClient());
            return venteRepo.save(existing);
        });
    }
}
