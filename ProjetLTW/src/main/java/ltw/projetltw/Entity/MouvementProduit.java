package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@With
@AllArgsConstructor
@NoArgsConstructor
public class MouvementProduit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    double quantite;

    @ManyToOne(cascade = CascadeType.ALL)
    Produit produit;

    @ManyToOne(cascade = CascadeType.ALL)
    Mouvement mouvement;

    @Temporal(TemporalType.TIMESTAMP)
    LocalDate dateCreation;

    @Temporal(TemporalType.TIMESTAMP)
    LocalDate dateModification;
}
