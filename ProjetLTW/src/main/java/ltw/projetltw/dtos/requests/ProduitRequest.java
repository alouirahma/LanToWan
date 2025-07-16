package ltw.projetltw.dtos.requests;

import jakarta.validation.constraints.*;

import lombok.Getter;
import lombok.Setter;
import ltw.projetltw.enums.CategorieProduit;
import ltw.projetltw.enums.TaxProduit;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProduitRequest {

    private Integer id;

    @NotBlank(message = "Reference cannot be empty")
    private String ref;

    @NotBlank(message = "Name cannot be empty")
    private String nom;

    @Min(value = 0, message = "Quantité Courante cannot be negative")
    private Double qteCourante;

    @Min(value = 0, message = "Prix Unitaire cannot be negative")
    private Double prixUnitaire;

    @NotNull(message = "Tax is required")
    TaxProduit tax;

    private Boolean comptable;

    private String numSerie;

    // private List<CategorieProduit> categories;

    private String bareCode;

    private String note;
}
