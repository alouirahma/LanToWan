package ltw.projetltw.dtos.responses;

import ltw.projetltw.enums.TaxProduit;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchatProduitResponse {

	private Integer id;
	private Double quantite;
	private Double prixUnitaire;
	private Double remise;
	private TaxProduit tax;

	private String reference;
	private String nomProduit;
	private Integer idAchat;
}
