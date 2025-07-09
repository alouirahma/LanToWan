package ltw.projetltw.entities;

import ltw.projetltw.enums.TaxProduit;

import java.io.Serializable;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "achat_produits")
public class AchatProduit implements Serializable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    Double quantite;

    @Column(nullable = false)
    Double prixUnitaire;

    Double remise;

    TaxProduit tax;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "id_produit", nullable = false)
    Produit produit;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "id_achat", nullable = false) 
    AchatEntity achat;
}
