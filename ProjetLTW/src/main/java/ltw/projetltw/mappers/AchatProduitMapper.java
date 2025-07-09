package ltw.projetltw.mappers;

import ltw.projetltw.dtos.requests.AchatProduitRequest;
import ltw.projetltw.dtos.responses.AchatProduitResponse;
import ltw.projetltw.entities.AchatProduit;

import org.springframework.stereotype.Component;

@Component
public class AchatProduitMapper {

	// Mapping Purchase Line entity to PurchaseLineResponse DTO
	public AchatProduitResponse toDto(AchatProduit entity) {
		if (entity == null)
			return null;

		return AchatProduitResponse.builder()
				.id(entity.getId())
				.quantite(entity.getQuantite())
				.prixUnitaire(entity.getPrixUnitaire())
				.remise(entity.getRemise())
				.tax(entity.getTax())
				.reference(entity.getProduit().getRef())
				.nomProduit(entity.getProduit().getNom())
				.idAchat(entity.getAchat().getId())
				.build();
	}

	// Mapping PurchaseLineRequest DTO to Purchase Line entity for creation
	public AchatProduit toEntity(AchatProduitRequest request) {
		if (request == null)
			return null;

		return AchatProduit.builder()
				// id: ignored (auto-generated)
				.quantite(request.getQuantite())
				.prixUnitaire(request.getPrixUnitaire())
				.remise(request.getRemise())
				.tax(request.getTax())
				// produit: ignored (set by the service using ID)
				// achat: ignored (set by the service using ID)
				.build();
	}

	// Mapping PurchaseLineRequest DTO to an existing Purchase Line entity for
	// updates
	public void updateEntityFromDto(AchatProduitRequest request, AchatProduit entity) {
		if (request == null || entity == null)
			return;
		// id: ignored
		entity.setQuantite(request.getQuantite());
		entity.setPrixUnitaire(request.getPrixUnitaire());
		entity.setRemise(request.getRemise());
		entity.setTax(request.getTax());
		// produit: ignored (set by the service using ID)
		// achat: ignored (set by the service using ID)
	}
}
