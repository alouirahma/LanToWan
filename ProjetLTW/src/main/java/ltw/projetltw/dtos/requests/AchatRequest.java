package ltw.projetltw.dtos.requests;

import lombok.*;
import ltw.projetltw.enums.StatutAchat;
import ltw.projetltw.enums.TypeAchat;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AchatRequest {
	
	@NotNull(message = "Code is required")
	private String code;

	@NotNull(message = "Type is required")
	private TypeAchat type;

	private LocalDate date;

	@NotNull(message = "Supplier ID is required")
    private Integer idDestinateur;

	private List<AchatProduitRequest> produits;

	@Min(value = 0, message = "Total Amount cannot be negative")
	private Double montantTotal;

	private StatutAchat statut;

	private Boolean deleteDocument;

	private String notes;

}
