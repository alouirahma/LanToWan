package ltw.projetltw.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ltw.projetltw.dtos.responses.AchatSummaryResponse;
import ltw.projetltw.entities.AchatEntity;

@Repository
public interface AchatRepository extends JpaRepository<AchatEntity, Integer> {

	@Query("SELECT new ltw.projetltw.dtos.responses.AchatSummaryResponse(a.id, a.numFacture, a.dateFacture, a.montantFacture, f.nom, f.matriculeFiscaleF) FROM AchatEntity a JOIN a.fournisseur f")
	List<AchatSummaryResponse> findAllSummary();

	List<AchatEntity> findByNumFacture(String invoiceNumber);
}