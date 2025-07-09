package ltw.projetltw.dtos.requests;

import ltw.projetltw.enums.TaxProduit;

import jakarta.validation.constraints.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AchatProduitRequest {

	@NotNull(message = "Quantity is required")
	@Min(value = 0, message = "Quantity cannot be negative")
	Double quantite;

	@NotNull(message = "Unit price is required")
	@Min(value = 0, message = "Unit price cannot be negative")
	Double prixUnitaire;

	@Min(value = 0, message = "Discount cannot be negative")
	Double remise;

	@NotNull(message = "VAT is required")
	TaxProduit tax;

	@NotNull(message = "Product ID is required")
	Integer idProduit;

	@NotNull(message = "Purchase ID is required")
	Integer idAchat;
}
