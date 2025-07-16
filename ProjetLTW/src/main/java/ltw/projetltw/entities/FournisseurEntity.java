package ltw.projetltw.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Table(name = "fournisseur")
public class FournisseurEntity extends Personne {
    @Column(name = "matricule_fiscal_f",unique = true)
    String matriculeFiscaleF;
}
