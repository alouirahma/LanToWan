package ltw.projetltw.Services;

import ltw.projetltw.Entity.Employee;

import java.util.List;
import java.util.Optional;

public interface IEmloyeeServ {
    List<Employee> findAll();
    Employee add(Employee emlpoyee);
    Optional<Employee> findById(Integer id);
    void deleteById(Integer id);
    Optional<Employee> update(Integer id, Employee updatedEmployee);
}
