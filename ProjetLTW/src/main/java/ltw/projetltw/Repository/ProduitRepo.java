package ltw.projetltw.Repository;

import ltw.projetltw.Entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProduitRepo extends JpaRepository<Produit, Integer> {
}
