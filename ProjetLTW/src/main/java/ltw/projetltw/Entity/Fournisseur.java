package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@With
@AllArgsConstructor
@NoArgsConstructor
public class Fournisseur extends Personne {

    String MatriculeFiscaleF;
}
