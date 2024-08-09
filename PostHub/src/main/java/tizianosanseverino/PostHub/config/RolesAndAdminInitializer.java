package tizianosanseverino.PostHub.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import tizianosanseverino.PostHub.entities.Role;
import tizianosanseverino.PostHub.entities.User;
import tizianosanseverino.PostHub.exceptions.BadRequestException;
import tizianosanseverino.PostHub.repositories.UserRolesRepository;
import tizianosanseverino.PostHub.repositories.UsersRepository;
import tizianosanseverino.PostHub.services.UserRolesService;

import java.util.List;

@Configuration
public class RolesAndAdminInitializer {

    @Autowired
    private UserRolesService rolesService;

    @Autowired
    private UserRolesRepository rolesRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder bcrypt;

    @PostConstruct
    public void initializeRolesAndAdminUser() {
        try {

            if (rolesRepository.findByName("ADMIN").isEmpty()) {
                rolesRepository.save(new Role("ADMIN"));
            }
            if (rolesRepository.findByName("USER").isEmpty()) {
                rolesRepository.save(new Role("USER"));
            }

            if (rolesRepository == null) {
                System.out.println("rolesService is null");
            } else {
                System.out.println("rolesService is initialized");
            }

            if (usersRepository.findByEmail("tizianosanseverino23@gmail.com").isEmpty()) {
                Role adminRole = rolesService.findByName("ADMIN");
                List<Role> roles = List.of(adminRole);
                User adminUser = new User(
                        "tiziano",

                        "sanseverino",
                        "tiziano.sanse",
                        "tizianosanseverino23@gmail.com",
                        bcrypt.encode("lazio123")
                        ,
                        "admin del social network",
                        "https://ui-avatars.com/api/?name=Tiziano+Sanseverino",
                        roles
                );
                usersRepository.save(adminUser);
                System.out.println("Admin user initialized successfully");
            } else {
                System.out.println("Admin user already exists.");
            }
        } catch (BadRequestException e) {
            System.out.println("Initialization failed: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("An error occurred during initialization: " + e.getMessage());
        }
    }
}