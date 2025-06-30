package ltw.projetltw.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@With
@AllArgsConstructor
@NoArgsConstructor
public abstract class Personne {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nom;

    private String adresse;

    private String email;

    private String telephone;

    @ManyToMany(cascade = CascadeType.ALL)
    public Set<Mouvement> mouvements; // does this have to be a set ?
}
