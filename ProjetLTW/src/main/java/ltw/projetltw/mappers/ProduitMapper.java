package ltw.projetltw.mappers;

import ltw.projetltw.dtos.requests.ProduitRequest;
import ltw.projetltw.dtos.responses.ProduitResponse;
import ltw.projetltw.entities.ProduitEntity;

import org.springframework.stereotype.Component;

@Component
public class ProduitMapper {

    // Mapping Product entity to ProductResponse DTO
    public ProduitResponse toDto(ProduitEntity entity) {
        if (entity == null)
            return null;

        return ProduitResponse.builder()
                .id(entity.getId())
                .ref(entity.getRef())
                .nom(entity.getNom())
                .qtePhy(entity.getQtePhy())
                .qteTheo(entity.getQteTheo())
                .qteCourante(entity.getQteCourante())
                .prixUnitaire(entity.getPrixUnitaire())
                .tax(entity.getTax())
                .comptable(entity.getComptable())
                .numSerie(entity.getNumSerie())
                .bareCode(entity.getBareCode())
                .note(entity.getNote())
                .build();
    }

    // Mapping ProductRequest DTO to Product entity for creation
    public ProduitEntity toEntity(ProduitRequest request) {
        if (request == null)
            return null;

        return ProduitEntity.builder()
                // id: ignored
                .ref(request.getRef())
                .nom(request.getNom())
                .qteCourante(request.getQteCourante())
                .prixUnitaire(request.getPrixUnitaire())
                .tax(request.getTax())
                .comptable(request.getComptable())
                .numSerie(request.getNumSerie())
                .bareCode(request.getBareCode())
                .note(request.getNote())
                .build();
    }

    // Mapping ProductRequest DTO to an existing Product entity for updates
    public void updateEntityFromDto(ProduitRequest request, ProduitEntity entity) {
        if (request == null || entity == null)
            return;

        // id is ignored (cant be updated)
        entity.setRef(request.getRef());
        entity.setNom(request.getNom());
        entity.setQteCourante(request.getQteCourante());
        entity.setPrixUnitaire(request.getPrixUnitaire());
        entity.setTax(request.getTax());
        entity.setComptable(request.getComptable());
        entity.setNumSerie(request.getNumSerie());
        entity.setBareCode(request.getBareCode());
        entity.setNote(request.getNote());
    }

}
