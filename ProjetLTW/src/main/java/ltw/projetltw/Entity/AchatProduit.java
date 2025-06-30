package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AchatProduit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    double quantite;

    double prixUnitaire;

    double remise;

    double tax;

    @ManyToOne(cascade = CascadeType.ALL)
    Produit produit;

    @ManyToOne(cascade = CascadeType.ALL)
    Achat achat;
}
