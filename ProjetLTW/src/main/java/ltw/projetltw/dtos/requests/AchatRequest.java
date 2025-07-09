package ltw.projetltw.dtos.requests;

import lombok.*;

import java.time.LocalDate;

import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AchatRequest {
	
	@NotNull(message = "Invoice Number is required")
	private String numFacture;
	
	@NotNull(message = "Invoice Date is required")
	private LocalDate dateFacture;
	
	@Min(value = 0, message = "Invoice Total cannot be negative")
	private Double montantFacture;

	private byte[] facture;

	@NotNull(message = "Supplier ID is required")
    private Integer idFournisseur;

}
