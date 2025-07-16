package ltw.projetltw.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ltw.projetltw.entities.AchatProduitEntity;

import java.util.List;

@Repository
public interface AchatProduitRepository extends JpaRepository<AchatProduitEntity, Integer> {
	List<AchatProduitEntity> findByAchatId(Integer id);
	boolean existsByProduitId(Integer id);
}