package ltw.projetltw.dtos.requests;

import jakarta.validation.constraints.*;

import lombok.*;
import ltw.projetltw.enums.TaxProduit;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AchatProduitRequest {

	Integer id;

	@NotNull(message = "Quantity is required")
	@Min(value = 0, message = "Quantity cannot be negative")
	Double quantite;

	@NotNull(message = "Unit price is required")
	@Min(value = 0, message = "Unit price cannot be negative")
	Double prixUnitaire;

	@NotNull(message = "VAT is required")
	TaxProduit tax;

	@Min(value = 0, message = "Discount cannot be negative")
	Double remise;

	@NotNull(message = "Product ID is required")
	Integer idProduit;
}
