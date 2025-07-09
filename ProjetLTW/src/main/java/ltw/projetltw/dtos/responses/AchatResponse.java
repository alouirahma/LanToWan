package ltw.projetltw.dtos.responses;

import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchatResponse {

	private Integer id;
	private String numeroFacture;
	private LocalDate dateFacture;
	private Double montantFacture;
	private byte[] facture;

	private Set<AchatProduitResponse> produits;

	private Integer idFournisseur;
	private String fournisseur;
	private String matriculeFiscal;

	private Instant dateCreation;
	private Instant dateModification;
}
