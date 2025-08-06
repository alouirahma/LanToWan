package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    String ref;
    String nom;
    Double qtePhy;
    Double qteTheo;
    Double prixUnitaire;
    Boolean comptable;
    String numSerie;
    CategorieProduit catProd;
    String bareCode;
    TaxProduit TaxProd;



}
