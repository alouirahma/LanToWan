package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VenteProduit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    double quantite;
    double prixUnitaire;
    double remise;
    double tva;
    double total;
    @ManyToOne(cascade = CascadeType.ALL)
    Produit produit;
    @ManyToOne(cascade = CascadeType.ALL)
    Vente vente;
}
