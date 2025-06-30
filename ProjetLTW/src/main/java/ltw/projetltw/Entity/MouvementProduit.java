package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.autoconfigure.web.WebProperties;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MouvementProduit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    double quantite;

    @ManyToOne(cascade = CascadeType.ALL)
    Produit produit;

    @ManyToOne(cascade = CascadeType.ALL)
    Mouvement mouvement;

    Date dateCreation;

    Date dateModification;
}
