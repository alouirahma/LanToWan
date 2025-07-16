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
                .code(entity.getCode())
                .type(entity.getType())
                .date(entity.getDate())
                .montantTotal(entity.getMontantTotal())
                .idDestinateur(entity.getFournisseur().getId())
                .destinateur(entity.getFournisseur().getNom())
                .statut(entity.getStatut())
                .document(entity.getDocument())
                .notes(entity.getNotes())
                .dateCreation(entity.getDateCreation())
                .dateModification(entity.getDateModification())
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
                .code(entity.getCode())
                .type(entity.getType())
                .date(entity.getDate())
                .statut(entity.getStatut())
                .montantTotal(entity.getMontantTotal())
                .idDestinateur(entity.getFournisseur().getId())
                .destinateur(entity.getFournisseur().getNom())
                .build();
    }

    // Mapping PurchaseRequest DTO to Purchase entity for creation
    public AchatEntity toEntity(AchatRequest request) {
        if (request == null)
            return null;

        return AchatEntity.builder()
                // id: ignored
                .code(request.getCode())
                .date(request.getDate())
                .type(request.getType())
                .montantTotal(request.getMontantTotal())
                // fournisseur: ignored (will be set by the service using ID)
                .statut(request.getStatut())
                // document : ignored (will be set by the service)
                .notes(request.getNotes())
                // dateModification: ignored (auto-generated)
                // dateCreateion: ignored (auto-generated)
                .build();
    }

    // Mapping PurchaseRequest DTO to an existing Purchase entity for updates
    public void updateEntityFromDto(AchatRequest request, AchatEntity entity) {
        if (request == null || entity == null)
            return;
        // id is ignored (cant be updated)
        entity.setCode(request.getCode());
        entity.setDate(request.getDate());
        entity.setType(request.getType());
        entity.setMontantTotal(request.getMontantTotal());
        entity.setStatut(request.getStatut());
        // document is ignore (will be set by the service)
        // fournisseur is ignored (will be set by the service using ID)
        entity.setNotes(request.getNotes());
        // dateModification is ignored (auto-generated)
        // dateCreateion is ignored (auto-generated)
    }
}