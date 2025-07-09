package ltw.projetltw.entities;

import java.util.Set;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@With
@AllArgsConstructor
public class Emlpoyee extends Personne {
	@ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "personne_mouvements",
        joinColumns = @JoinColumn(name = "personne_id"),
        inverseJoinColumns = @JoinColumn(name = "mouvement_id")
    )

    Set<Mouvement> mouvements;
}
