package ltw.projetltw.Services;

import lombok.AllArgsConstructor;
import ltw.projetltw.Entity.Client;
import ltw.projetltw.Repository.ClientRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ClientService implements IClientServ {
    ClientRepo clientRepo;
    public List<Client> findAll() {
        return clientRepo.findAll();
    }

    public Client add(Client client) {
        return clientRepo.save(client);
    }

    public Optional<Client> findById(Integer id) {
        return clientRepo.findById(id);
    }

    public void deleteById(Integer id) {
        clientRepo.deleteById(id);
    }

    public Optional<Client> update(Integer id, Client updatedClient) {
        return clientRepo.findById(id).map(existing -> {
            existing.setNom(updatedClient.getNom());
            existing.setEmail(updatedClient.getEmail());
            existing.setAdresse(updatedClient.getAdresse());
            existing.setTelephone(updatedClient.getTelephone());
            existing.setMatriculeFiscaleC(updatedClient.getMatriculeFiscaleC());
            return clientRepo.save(existing);
        });
    }

}
