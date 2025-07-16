package ltw.projetltw.entities;

import jakarta.persistence.*;
import lombok.*;
import ltw.projetltw.enums.TypeMvmt;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Getter
@Setter
@With
@AllArgsConstructor
@NoArgsConstructor
public class Mouvement implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    TypeMvmt type;

    @Column(nullable = false)
    LocalDate dateMvmt;

    //@ManyToMany(mappedBy = "mouvements",cascade = CascadeType.ALL)
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "client_mouvements", joinColumns = @JoinColumn(name = "mouvement_id"), inverseJoinColumns = @JoinColumn(name = "client_id"))
    Set<Client> clients;
}
