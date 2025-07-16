package ltw.projetltw.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ltw.projetltw.entities.ProduitEntity;


@Repository
public interface ProduitRepository extends JpaRepository<ProduitEntity, Integer> {
	
	List<ProduitEntity> findByNom(String nom);
	Optional<ProduitEntity> findByRef(String reference);
	Optional<ProduitEntity> findByBareCode(String bareCode);
	Optional<ProduitEntity> findByNumSerie(String numeroDeSerie);
}