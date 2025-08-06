package ltw.projetltw.Services;

import ltw.projetltw.Entity.Client;

import java.util.List;
import java.util.Optional;

public interface IClientServ {

    List<Client> findAll();
    Client add(Client client);
    Optional<Client> findById(Integer id);
    void deleteById(Integer id);
    Optional<Client> update(Integer id, Client updatedClient);
}
