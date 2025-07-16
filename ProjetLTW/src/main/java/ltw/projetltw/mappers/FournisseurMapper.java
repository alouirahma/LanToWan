package ltw.projetltw.mappers;
// package ltw.projetltw.mappers;

import ltw.projetltw.dtos.requests.FournisseurRequest;
import ltw.projetltw.dtos.responses.FournisseurResponse;
import ltw.projetltw.entities.FournisseurEntity;

import org.springframework.stereotype.Component;

@Component
public class FournisseurMapper {

    // Mapping Purchase entity to PurchaseResponse DTO
    public FournisseurResponse toDto(FournisseurEntity entity) {
        if (entity == null)
            return null;

        return FournisseurResponse.builder()
                .id(entity.getId())
                .nom(entity.getNom())
                .adresse(entity.getAdresse())
                .telephone(entity.getTelephone())
                .email(entity.getEmail())
                .matriculeFiscale(entity.getMatriculeFiscaleF())
                .build();
    }

    // Mapping PurchaseRequest DTO to Purchase entity for creation
    public FournisseurEntity toEntity(FournisseurRequest request) {
        if (request == null)
            return null;

        return FournisseurEntity.builder()
                // id: ignored
                .nom(request.getNom())
                .adresse(request.getAdresse())
                .telephone(request.getTelephone())
                .email(request.getEmail())
                .matriculeFiscaleF(request.getMatriculeFiscale())
                .build();
    }

    // Mapping PurchaseRequest DTO to an existing Purchase entity for updates
    public void updateEntityFromDto(FournisseurRequest request, FournisseurEntity entity) {
        if (request == null || entity == null)
            return;

        // id is ignored (cant be updated)
        entity.setNom(request.getNom());
        entity.setAdresse(request.getAdresse());
        entity.setEmail(request.getEmail());
        entity.setTelephone(request.getTelephone());
        entity.setMatriculeFiscaleF(request.getMatriculeFiscale());
    }

}