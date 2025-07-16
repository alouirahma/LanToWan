package ltw.projetltw.entities;

import java.io.Serializable;

import jakarta.persistence.*;
import lombok.*;
import ltw.projetltw.enums.CategorieProduit;
import ltw.projetltw.enums.TaxProduit;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE produit SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
@Table(name = "produit")
public class ProduitEntity extends BaseEntity {

    @Column(name = "reference", nullable = false, unique = true)
    String ref;

    @Column(name = "nom", nullable = false)
    String nom;

    @Column(name = "qantite_physique")
    Double qtePhy;

    @Column(name = "qantite_theorique")
    Double qteTheo;

    @Column(name = "qantite_courante")
    Double qteCourante;

    @Column(name = "prix_unitaire", nullable = false)
    Double prixUnitaire;

    @Column(name = "tax", nullable = false)
    TaxProduit tax;

    @Column(name = "comptable", nullable = false)
    Boolean comptable;

    @Column(name = "numero_de_serie")
    String numSerie;

    // @Column(name = "categories")
    // List<CategorieProduit> categories;

    @Column(name = "barcode")
    String bareCode;
}
