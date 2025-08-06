package ltw.projetltw.Services;

import lombok.AllArgsConstructor;
import ltw.projetltw.Entity.Employee;
import ltw.projetltw.Repository.EmployeeRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class EmployeeService implements IEmloyeeServ{
    EmployeeRepo empRepo;

    public List<Employee> findAll() {
        return empRepo.findAll();
    }

    public Employee add(Employee emlpoyee) {
        return empRepo.save(emlpoyee);
    }

    public Optional<Employee> findById(Integer id) {
        return empRepo.findById(id);
    }

    public void deleteById(Integer id) {
        empRepo.deleteById(id);
    }

    public Optional<Employee> update(Integer id, Employee updatedEmployee) {
        return empRepo.findById(id).map(existing -> {
            existing.setNom(updatedEmployee.getNom());
            existing.setEmail(updatedEmployee.getEmail());
            existing.setAdresse(updatedEmployee.getAdresse());
            existing.setTelephone(updatedEmployee.getTelephone());
            return empRepo.save(existing);
        });
    }
}
