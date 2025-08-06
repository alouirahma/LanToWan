package ltw.projetltw.Repository;

import ltw.projetltw.Entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepo extends JpaRepository<Client, Integer> {
    Optional<Client> findByMatriculeFiscaleC(String matricule);


}
