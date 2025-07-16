package ltw.projetltw.dtos.responses;

import lombok.*;
import ltw.projetltw.enums.TaxProduit;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProduitResponse {

    private Integer id;

    private String ref;

    private String nom;

    private Double qtePhy;

    private Double qteTheo;

    private Double qteCourante;

    private Double prixUnitaire;

    TaxProduit tax;

    private Boolean comptable;

    private String numSerie;

    // private List<CategorieProduit> categories;

    private String bareCode;

    private String note;
}
