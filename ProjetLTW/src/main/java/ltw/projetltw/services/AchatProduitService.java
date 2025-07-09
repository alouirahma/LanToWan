package ltw.projetltw.services;

import ltw.projetltw.entities.AchatEntity;
import ltw.projetltw.entities.AchatProduit;
import ltw.projetltw.entities.Produit;
import ltw.projetltw.exceptions.ResourceNotFoundException;
import ltw.projetltw.repositories.AchatProduitRepository;
import ltw.projetltw.repositories.AchatRepository;
import ltw.projetltw.repositories.ProduitRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AchatProduitService {

    private final AchatProduitRepository achatProduitRepository;
    private final ProduitRepository produitRepository; // To fetch Produit
    private final AchatRepository achatRepository; // To fetch Achat

    @Transactional(readOnly = true)
    public List<AchatProduit> getAllAchatProduits() {
        log.debug("Fetching all AchatProduits");
        return achatProduitRepository.findAll();
    }

    @Transactional(readOnly = true)
    public AchatProduit getAchatProduitById(Integer id) {
        log.debug("Fetching AchatProduit with id: {}", id);
        return achatProduitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AchatProduit not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<AchatProduit> getAchatProduitsByAchatId(Integer achatId) {
        log.debug("Fetching Product Line for Purchase ID: {}", achatId);
        return achatProduitRepository.findByAchatId(achatId);
    }

    @Transactional(readOnly = true)
    public List<AchatProduit> getAchatProduitsByAchatNumFacture(String numFacture) {
        log.debug("Fetching Product Line for Purchase numFacture: {}", numFacture);
        List<AchatEntity> achats = achatRepository.findByNumFacture(numFacture);
        if (achats.isEmpty()) {
            throw new ResourceNotFoundException("Purchase not found with invoice number: " + numFacture);
        }
        Integer achatId = achats.get(0).getId();
        return getAchatProduitsByAchatId(achatId);
    }

    @Transactional
    public AchatProduit createAchatProduit(AchatProduit achatProduit, Integer produitId, Integer achatId) {
        log.info("Attempting to create Product Line for Product ID: {} and Purchase ID: {}", produitId, achatId);

        Produit produit = produitRepository.findById(produitId)
                .orElseThrow(() -> {
                    log.warn("Product not found with id: {}", produitId);
                    return new ResourceNotFoundException("Product not found with id: " + produitId);
                });

        AchatEntity achat = achatRepository.findById(achatId)
                .orElseThrow(() -> {
                    log.warn("Purchase not found with id: {}", achatId);
                    return new ResourceNotFoundException("Purchase not found with id: " + achatId);
                });

        achatProduit.setProduit(produit);
        achatProduit.setAchat(achat);

        AchatProduit savedAchatProduit = achatProduitRepository.save(achatProduit);
        log.info("Product Line created successfully with ID: {}", savedAchatProduit.getId());
        return savedAchatProduit;
    }

    @Transactional
    public AchatProduit updateAchatProduit(Integer id, AchatProduit achatProduitDetails, Integer produitId,
            Integer achatId) {
        log.info("Attempting to update Product Line with ID: {}", id);
        AchatProduit existingAchatProduit = getAchatProduitById(id);

        // Update fields directly from the details object
        existingAchatProduit.setQuantite(achatProduitDetails.getQuantite());
        existingAchatProduit.setPrixUnitaire(achatProduitDetails.getPrixUnitaire());
        existingAchatProduit.setRemise(achatProduitDetails.getRemise());
        existingAchatProduit.setTax(achatProduitDetails.getTax());

        AchatProduit updatedAchatProduit = achatProduitRepository.save(existingAchatProduit);
        log.info("Product Line with ID {} updated successfully", updatedAchatProduit.getId());
        return updatedAchatProduit;
    }

    @Transactional
    public void deleteAchatProduit(Integer id) {
        log.info("Attempting to delete Product Line with ID: {}", id);
        AchatProduit achatProduit = getAchatProduitById(id);
        achatProduitRepository.delete(achatProduit);
        log.info("Product Line with ID {} deleted successfully", id);
    }

}