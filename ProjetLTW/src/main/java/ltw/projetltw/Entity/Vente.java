package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Blob;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@With
@AllArgsConstructor
@NoArgsConstructor
public class Vente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    String numeroVente;

    @Lob
    Blob facture;

    ModePaiement modePaiment;
    Double montantTotal;

    @Lob
    Blob documentPaiement;

    Boolean dinardTimbre;

    @ManyToOne(cascade = CascadeType.ALL)
    Client client;

    LocalDate dateCreation;

    LocalDate dateModification;

}
