package tizianosanseverino.PostHub.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tizianosanseverino.PostHub.entities.Role;

import java.util.Optional;

@Repository
public interface UserRolesRepository extends JpaRepository<Role, String> {
    Optional<Role> findByName(String name);
}
