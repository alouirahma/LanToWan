package ltw.projetltw.mappers;

import ltw.projetltw.dtos.requests.AchatRequest;
import ltw.projetltw.dtos.responses.AchatResponse;
import ltw.projetltw.dtos.responses.AchatSummaryResponse;
import ltw.projetltw.entities.AchatEntity;

import org.springframework.stereotype.Component;

@Component
public class AchatMapper {

    // Mapping Purchase entity to PurchaseResponse DTO
    public AchatResponse toDto(AchatEntity entity) {
        if (entity == null)
            return null;

        return AchatResponse.builder()
                .id(entity.getId())
                .numeroFacture(entity.getNumFacture())
                .dateFacture(entity.getDateFacture())
                .montantFacture(entity.getMontantFacture())
                .facture(entity.getFacture())
                .idFournisseur(entity.getFournisseur().getId())
                .fournisseur(entity.getFournisseur().getNom())
                .matriculeFiscal(entity.getFournisseur().getMatriculeFiscaleF())
                // produits: ignored (will be set by the service layer)
                .build();
    }

    // Mapping Purchase entity to PurchaseSummaryResponse DTO
    public AchatSummaryResponse toSummaryDto(AchatEntity entity) {
        if (entity == null) {
            return null;
        }

        return AchatSummaryResponse.builder()
                .id(entity.getId())
                .numeroFacture(entity.getNumFacture())
                .dateFacture(entity.getDateFacture())
                .montantFacture(entity.getMontantFacture())
                .fournisseur(entity.getFournisseur().getNom())
                .matriculeFiscal(entity.getFournisseur().getMatriculeFiscaleF())
                .build();
    }

    // Mapping PurchaseRequest DTO to Purchase entity for creation
    public AchatEntity toEntity(AchatRequest request) {
        if (request == null)
            return null;

        return AchatEntity.builder()
                // id: ignored
                .numFacture(request.getNumFacture())
                .dateFacture(request.getDateFacture())
                .montantFacture(request.getMontantFacture())
                // facture: ignored (will be set by the service layer)
                // fournisseur: ignored (will be set by the service using ID)
                // dateModification: ignored (auto-generated)
                // dateCreateion: ignored (auto-generated)
                .build();
    }

    // Mapping PurchaseRequest DTO to an existing Purchase entity for updates
    void updateEntityFromDto(AchatRequest request, AchatEntity entity) {
        if (request == null || entity == null)
            return;
        // id is ignored (auto-generated)
        entity.setNumFacture(request.getNumFacture());
        entity.setDateFacture(request.getDateFacture());
        entity.setMontantFacture(request.getMontantFacture());
        // facture: ignored (will be set by the service layer)
        // fournisseur is ignored (will be set by the service using ID)
        // dateModification is ignored (auto-generated)
        // dateCreateion is ignored (auto-generated)
    }
}