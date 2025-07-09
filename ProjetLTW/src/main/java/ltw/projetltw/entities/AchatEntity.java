package ltw.projetltw.entities;

import jakarta.persistence.*;

import lombok.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(name = "achats")
public class AchatEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "numero_facture", nullable = false, unique = true)
    String numFacture;

    @Column(name = "date_facture", nullable = false)
    LocalDate dateFacture;

    @Column(name = "montant_facture")
    Double montantFacture;

    @Lob
    @Column(name = "facture")
    byte[] facture;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_fournisseur", nullable = false)
    Fournisseur fournisseur;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    Instant dateCreation;

    @LastModifiedDate
    Instant dateModification;
}
