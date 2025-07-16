package ltw.projetltw.entities;

import java.io.Serializable;

import jakarta.persistence.*;

import lombok.*;
import ltw.projetltw.enums.TaxProduit;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE achat_produit SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
@Table(name = "achat_produit")
public class AchatProduitEntity extends BaseEntity {

    @Column(name = "quantite", nullable = false)
    Double qte;

    @Column(name = "prix_unitaire", nullable = false)
    Double prixUnitaire;

    @Column(name = "remise")
    Double remise;

    @Column(name = "tax")
    TaxProduit tax;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_produit", nullable = false)
    ProduitEntity produit;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_achat", nullable = false)
    AchatEntity achat;
}
