package ltw.projetltw.Services;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import ltw.projetltw.Entity.Client;
import ltw.projetltw.Entity.Vente;
import ltw.projetltw.Entity.VenteProduit;
import ltw.projetltw.Repository.ClientRepo;
import ltw.projetltw.Repository.VenteRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class VenteService implements IVenteServ {
    private final VenteRepo venteRepo;
    private final ClientRepo clientRepo;
    private final String UPLOAD_DIR = "uploads/";

    public List<Vente> findAll() {
        return venteRepo.findAll();
    }

    public Vente add(Vente vente, MultipartFile documentFile) {
        if (vente.getClient() != null && vente.getClient().getId() != null) {
            Client clientExistant = clientRepo.findById(vente.getClient().getId())
                    .orElseThrow(() -> new RuntimeException("Client non trouvé avec ID " + vente.getClient().getId()));
            vente.setClient(clientExistant);
        } else {
            throw new RuntimeException("Aucun client valide fourni.");
        }

        // Gérer le fichier uniquement s'il est fourni (optionnel ici)
        if (documentFile != null && !documentFile.isEmpty()) {
            try {
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                String fileName = System.currentTimeMillis() + "_" + documentFile.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                documentFile.transferTo(filePath.toFile());
                vente.setDocumentPaiement(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de l'upload du fichier : " + e.getMessage());
            }
        }

        if (vente.getVenteProduits() != null) {
            vente.getVenteProduits().forEach(vp -> {
                vp.setVente(vente);
                vp.setTotal(vp.getQuantite() * vp.getPrixUnitaire() * (1 - vp.getRemise() / 100) * (1 + vp.getTva() / 100));
            });
            vente.setMontantTotal(vente.getVenteProduits().stream().mapToDouble(VenteProduit::getTotal).sum());
        }

        return venteRepo.save(vente);
    }

    public Optional<Vente> findById(Integer id) {
        return venteRepo.findById(id);
    }

    public void deleteById(Integer id) throws EntityNotFoundException {
        Vente vente = venteRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vente non trouvée avec l'ID : " + id));

        // Dissocie le client en mettant client_id à NULL
        vente.setClient(null);
        venteRepo.save(vente); // Sauvegarde la mise à jour

        // Supprime la vente
        venteRepo.deleteById(id);
    }

    public Optional<Vente> update(Integer id, Vente updatedVente, MultipartFile documentFile) {
        return venteRepo.findById(id).map(existing -> {
            existing.setNumeroVente(updatedVente.getNumeroVente());
            existing.setFacture(updatedVente.getFacture());
            existing.setModePaiement(updatedVente.getModePaiement());
            existing.setDocumentPaiement(updatedVente.getDocumentPaiement());
            existing.setDinardTimbre(updatedVente.getDinardTimbre());
            existing.setDateCreation(updatedVente.getDateCreation());
            existing.setDateModification(updatedVente.getDateModification());
            existing.setTypeVente(updatedVente.getTypeVente());

            if (updatedVente.getClient() != null && updatedVente.getClient().getId() != null) {
                Client clientExistant = clientRepo.findById(updatedVente.getClient().getId())
                        .orElseThrow(() -> new RuntimeException("Client non trouvé avec ID " + updatedVente.getClient().getId()));
                existing.setClient(clientExistant);
            }

            if (documentFile != null && !documentFile.isEmpty()) {
                try {
                    Path uploadPath = Paths.get(UPLOAD_DIR);
                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }
                    String fileName = System.currentTimeMillis() + "_" + documentFile.getOriginalFilename();
                    Path filePath = uploadPath.resolve(fileName);
                    documentFile.transferTo(filePath.toFile());
                    existing.setDocumentPaiement(fileName);
                } catch (IOException e) {
                    throw new RuntimeException("Erreur lors de l'upload du fichier : " + e.getMessage());
                }
            }

            existing.getVenteProduits().clear();
            if (updatedVente.getVenteProduits() != null) {
                updatedVente.getVenteProduits().forEach(vp -> {
                    vp.setVente(existing);
                    vp.setTotal(vp.getQuantite() * vp.getPrixUnitaire() * (1 - vp.getRemise() / 100) * (1 + vp.getTva() / 100));
                    existing.getVenteProduits().add(vp);
                });
                existing.setMontantTotal(existing.getVenteProduits().stream().mapToDouble(VenteProduit::getTotal).sum());
            }

            return venteRepo.save(existing);
        });
    }
}