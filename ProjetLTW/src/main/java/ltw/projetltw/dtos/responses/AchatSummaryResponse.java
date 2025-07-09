// src/main/java/ltw/projetltw/dtos/responses/AchatSummaryResponse.java
package ltw.projetltw.dtos.responses;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchatSummaryResponse {

    private Integer id;
    private String numeroFacture;
    private LocalDate dateFacture;
    private Double montantFacture;

    private String fournisseur;
    private String matriculeFiscal;

}