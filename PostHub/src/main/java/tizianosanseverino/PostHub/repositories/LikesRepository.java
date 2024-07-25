package tizianosanseverino.PostHub.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tizianosanseverino.PostHub.entities.MiPiace;

import java.util.UUID;

@Repository
public interface LikesRepository extends JpaRepository<MiPiace, UUID> {

}
