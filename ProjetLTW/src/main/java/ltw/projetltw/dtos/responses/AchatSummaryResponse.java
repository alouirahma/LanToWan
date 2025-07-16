// src/main/java/ltw/projetltw/dtos/responses/AchatSummaryResponse.java
package ltw.projetltw.dtos.responses;

import lombok.*;
import ltw.projetltw.enums.StatutAchat;
import ltw.projetltw.enums.TypeAchat;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchatSummaryResponse {

    private Integer id;
    private String code;
    private TypeAchat type;
    private LocalDate date;
    private Double montantTotal;

    private Integer idDestinateur;
    private String destinateur;

    private StatutAchat statut;

}