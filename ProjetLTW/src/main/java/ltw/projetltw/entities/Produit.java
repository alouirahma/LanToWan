package ltw.projetltw.entities;

import ltw.projetltw.enums.TaxProduit;
import ltw.projetltw.enums.CategorieProduit;

import java.io.Serializable;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@With
@NoArgsConstructor
@AllArgsConstructor
public class Produit implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    String ref;

    @Column(nullable = false)
    String nom;

    Double qtePhy;

    Double qteTheo;

    @Column(nullable = false)
    Double prixUnitaire;

    @Column(nullable = false)
    Boolean comptable;

    String numSerie;

    CategorieProduit catProd;

    String bareCode;

    TaxProduit TaxProd;
}
