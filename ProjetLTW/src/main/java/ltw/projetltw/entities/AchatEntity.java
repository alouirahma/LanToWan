package ltw.projetltw.entities;

import jakarta.persistence.*;

import lombok.*;
import ltw.projetltw.enums.StatutAchat;
import ltw.projetltw.enums.TypeAchat;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
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
@SQLDelete(sql = "UPDATE achat SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
@Table(name = "achat")
public class AchatEntity extends BaseAuditableEntity {

    @Column(name = "code", nullable = false, unique = true)
    String code;

    @Column(name = "type", nullable = false)
    TypeAchat type;

    @Column(name = "date", nullable = false)
    LocalDate date;

    @Column(name = "montant_total")
    Double montantTotal;

    @Column(name = "document")
    String document;

    @Column(name = "statut")
    StatutAchat statut;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_fournisseur", nullable = false)
    FournisseurEntity fournisseur;

    @Column(name = "notes")
    String notes;
}
