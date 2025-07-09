package ltw.projetltw.entities;

import ltw.projetltw.enums.TaxProduit;

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
    
    @Column(nullable = false)
    Double quantite;
    
    @Column(nullable = false)
    Double prixUnitaire;

    Double remise;

    TaxProduit tax;

    @ManyToOne(cascade = CascadeType.ALL)
    Produit produit;
    
    @ManyToOne(cascade = CascadeType.ALL)
    Vente vente;
}
