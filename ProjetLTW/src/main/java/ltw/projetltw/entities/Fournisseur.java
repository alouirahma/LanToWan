package ltw.projetltw.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@With
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "fournisseurs")
// @PrimaryKeyJoinColumn(name = "fournisseur_id")
public class Fournisseur extends Personne {
    @Column(unique = true)
    String matriculeFiscaleF;
}
