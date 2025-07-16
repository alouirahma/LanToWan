package ltw.projetltw.dtos.requests;

import jakarta.validation.constraints.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FournisseurRequest {

    @NotBlank(message = "Name cannot be empty")
    private String nom;

    private String adresse;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^[0-9]{8}$", message = "Phone number must be 8 digits") // Example pattern for Tunisian numbers
    private String telephone;

    @NotBlank(message = "Matricule Fiscale cannot be empty")
    private String matriculeFiscale;
}
