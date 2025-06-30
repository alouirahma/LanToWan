package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@With
@AllArgsConstructor
@NoArgsConstructor
public class VenteProduit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    double quantite;

    double prixUnitaire;

    double remise;

    TaxProduit tax;

    double total;
    @ManyToOne(cascade = CascadeType.ALL)
    Produit produit;
    @ManyToOne(cascade = CascadeType.ALL)
    Vente vente;
}
