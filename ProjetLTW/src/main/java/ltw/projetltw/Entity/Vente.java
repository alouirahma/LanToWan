package ltw.projetltw.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Vente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    String numeroVente;
    @Column(length = 255)
    String facture;
    ModePaiement modePaiement;
    Double montantTotal;
    @Column(length = 255)
    String documentPaiement;
    Boolean dinardTimbre;
    Date dateCreation;
    Date dateModification;
    TypeVente typeVente;
    @ManyToOne(cascade = CascadeType.ALL)
    Client client;

    @OneToMany(mappedBy = "vente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VenteProduit> venteProduits = new ArrayList<>();
}