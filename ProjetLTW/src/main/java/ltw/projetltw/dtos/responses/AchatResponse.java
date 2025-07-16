package ltw.projetltw.dtos.responses;

import lombok.*;
import ltw.projetltw.enums.StatutAchat;
import ltw.projetltw.enums.TypeAchat;

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
    private String code;
    private TypeAchat type;
    private LocalDate date;
    private Double montantTotal;
    private StatutAchat statut;
    private String document;

    private Set<AchatProduitResponse> produits;

    private Integer idDestinateur;
    private String destinateur;

    private String notes;
    private Instant dateCreation;
    private Instant dateModification;
}
