package ltw.projetltw.entities;

import java.util.Set;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@With
@AllArgsConstructor
@NoArgsConstructor
public class Client extends Personne {

    String matriculeFiscale;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "client_mouvements", joinColumns = @JoinColumn(name = "client_id"), inverseJoinColumns = @JoinColumn(name = "mouvement_id"))
    Set<Mouvement> mouvements;
}
