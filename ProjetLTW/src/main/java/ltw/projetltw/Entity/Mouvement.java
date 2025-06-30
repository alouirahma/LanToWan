package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Getter
@Setter
@With
@AllArgsConstructor
@NoArgsConstructor
public class Mouvement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    TypeMvmt type;

    LocalDate dateMvmt;

    // reminder to add client to movement if something went wrong

    @ManyToMany(mappedBy = "mouvements", cascade = CascadeType.ALL)
    public Set<Personne> personnes;
}
