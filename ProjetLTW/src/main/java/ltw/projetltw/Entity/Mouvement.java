package ltw.projetltw.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.autoconfigure.web.WebProperties;

import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Mouvement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    TypeMvmt type;

    Date dateMvt;

    // reminder to add client to movement if something went wrong

    @ManyToMany(mappedBy = "mouvements", cascade = CascadeType.ALL)
    public Set<Personne> personnes;
}
