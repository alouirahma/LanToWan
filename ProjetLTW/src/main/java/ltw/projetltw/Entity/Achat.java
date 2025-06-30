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
public class Achat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    String facture;

    @ManyToOne(cascade = CascadeType.ALL)
    Fournisseur fournisseur;

    Date dateCreation;

    Date dateModification;
}
