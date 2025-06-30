package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@With
@NoArgsConstructor
@AllArgsConstructor
public class AchatProduit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    double quantite;

    double prixUnitaire;

    double remise;

    TaxProduit tax;

    @ManyToOne(cascade = CascadeType.ALL)
    Produit produit;

    @ManyToOne(cascade = CascadeType.ALL)
    Achat achat;
}
