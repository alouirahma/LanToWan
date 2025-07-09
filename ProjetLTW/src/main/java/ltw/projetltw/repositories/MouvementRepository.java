package ltw.projetltw.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ltw.projetltw.entities.Mouvement;

public interface MouvementRepository extends JpaRepository<Mouvement, Integer> {
	
}