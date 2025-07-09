package ltw.projetltw.entities;

import jakarta.persistence.*;
import lombok.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.Instant;

@Entity
@Getter
@Setter
@With
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class MouvementProduit implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    Double quantite;

    @ManyToOne(cascade = CascadeType.ALL)
    Produit produit;

    @ManyToOne(cascade = CascadeType.ALL)
    Mouvement mouvement;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    Instant dateCreation;

    @LastModifiedDate
    Instant dateModification;
}
