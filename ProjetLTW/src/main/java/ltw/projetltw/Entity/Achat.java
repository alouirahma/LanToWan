package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Blob;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@With
@NoArgsConstructor
@AllArgsConstructor
public class Achat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Lob
    Blob facture;

    @ManyToOne(cascade = CascadeType.ALL)
    Fournisseur fournisseur;

    LocalDate dateCreation;

    LocalDate dateModification;
}
