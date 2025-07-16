package ltw.projetltw.dtos.responses;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FournisseurResponse {

	private Integer id;
	String nom;
	String adresse;
	String email;
	String telephone;
	String matriculeFiscale;
}
