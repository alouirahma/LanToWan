package ltw.projetltw.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ltw.projetltw.entities.MouvementProduit;

public interface MouvementProduitRepository extends JpaRepository<MouvementProduit, Integer> {
	
}