package ltw.projetltw.repositories;

import ltw.projetltw.entities.AchatProduit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchatProduitRepository extends JpaRepository<AchatProduit, Integer> {
	List<AchatProduit> findByAchatId(Integer id);
}