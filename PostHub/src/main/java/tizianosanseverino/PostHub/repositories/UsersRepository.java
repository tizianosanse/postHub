package tizianosanseverino.PostHub.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import tizianosanseverino.PostHub.entities.User;
import java.util.Optional;
import java.util.UUID;


public interface UsersRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(UUID userId);

}
