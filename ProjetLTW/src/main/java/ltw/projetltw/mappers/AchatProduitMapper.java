package ltw.projetltw.mappers;

import ltw.projetltw.dtos.requests.AchatProduitRequest;
import ltw.projetltw.dtos.responses.AchatProduitResponse;
import ltw.projetltw.entities.AchatProduitEntity;

import org.springframework.stereotype.Component;

@Component
public class AchatProduitMapper {

	// Mapping Purchase Line entity to PurchaseLineResponse DTO
	public AchatProduitResponse toDto(AchatProduitEntity entity) {
		if (entity == null)
			return null;

		return AchatProduitResponse.builder()
				.id(entity.getId())
				.quantite(entity.getQte())
				.prixUnitaire(entity.getPrixUnitaire())
				.tax(entity.getTax())
				.remise(entity.getRemise())
				.reference(entity.getProduit().getRef())
				.produit(entity.getProduit().getNom())
				.build();
	}

	// Mapping PurchaseLineRequest DTO to Purchase Line entity for creation
	public AchatProduitEntity toEntity(AchatProduitRequest request) {
		if (request == null)
			return null;

		return AchatProduitEntity.builder()
				// id: ignored (auto-generated)
				.qte(request.getQuantite())
				.prixUnitaire(request.getPrixUnitaire())
				.tax(request.getTax())
				.remise(request.getRemise())
				// produit: ignored (set by the service using ID)
				// achat: ignored (set by the service using ID)
				.build();
	}

	// Mapping PurchaseLineRequest DTO to an existing Purchase Line entity for
	// updates
	public void updateEntityFromDto(AchatProduitRequest request, AchatProduitEntity entity) {
		if (request == null || entity == null)
			return;
		// id: ignored
		entity.setQte(request.getQuantite());
		entity.setPrixUnitaire(request.getPrixUnitaire());
		entity.setTax(request.getTax());
		entity.setRemise(request.getRemise());
		// produit: ignored (set by the service using ID)
		// achat: ignored (set by the service using ID)
	}
}
