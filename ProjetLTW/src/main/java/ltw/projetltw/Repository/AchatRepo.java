package ltw.projetltw.Repository;

import ltw.projetltw.Entity.Achat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AchatRepo extends JpaRepository<Achat, Integer> {
}
