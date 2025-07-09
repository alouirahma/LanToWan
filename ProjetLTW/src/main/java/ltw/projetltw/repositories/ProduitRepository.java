package ltw.projetltw.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ltw.projetltw.entities.Produit;
import ltw.projetltw.enums.CategorieProduit;




@Repository
public interface ProduitRepository extends JpaRepository<Produit, Integer> {
	
	List<Produit> findByCatProd(CategorieProduit catProd);
	List<Produit> findByNom(String nom);
	Optional<Produit> findByRef(String ref);
	Optional<Produit> findByBareCode(String bareCode);
	Optional<Produit> findByNumSerie(String numSerie);
}