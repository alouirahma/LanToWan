package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Vente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    String numeroVente;
    @Column(length = 255)
    String facture;
    ModePaiement modePaiment;
    Double montantTotal;
    @Column(length =255)
    String documentPaiement;
    Boolean dinardTimbre;
    Date dateCreation;
    Date dateModification;

     @ManyToOne(cascade = CascadeType.ALL)
    Client client;


}
