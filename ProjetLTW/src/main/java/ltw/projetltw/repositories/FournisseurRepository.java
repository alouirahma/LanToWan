package ltw.projetltw.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ltw.projetltw.entities.FournisseurEntity;

import java.util.Optional;

@Repository
public interface FournisseurRepository extends JpaRepository<FournisseurEntity, Integer> {

    Optional<FournisseurEntity> findByMatriculeFiscaleF(String matriculeFiscale);

}