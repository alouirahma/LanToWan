package ltw.projetltw.entities;

import ltw.projetltw.enums.ModePaiement;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.sql.Blob;
import java.time.Instant;

@Entity
@Getter
@Setter
@AllArgsConstructor
@With
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Vente implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    String numeroVente;

    @Lob
    Blob facture;

    ModePaiement modePaiment;

    Double montantTotal;

    @Lob
    Blob documentPaiement;

    Boolean dinardTimbre;

    @ManyToOne(cascade = CascadeType.ALL)
    Client client;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    Instant dateCreation;

    @LastModifiedDate
    Instant dateModification;
}
