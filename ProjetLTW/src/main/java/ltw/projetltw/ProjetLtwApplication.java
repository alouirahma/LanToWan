package ltw.projetltw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing // This annotation enables JPA Auditing features.
public class ProjetLtwApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjetLtwApplication.class, args);
    }

}
