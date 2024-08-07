package tizianosanseverino.PostHub.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tizianosanseverino.PostHub.entities.MiPiace;
import tizianosanseverino.PostHub.entities.Post;
import tizianosanseverino.PostHub.entities.User;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LikesRepository extends JpaRepository<MiPiace, UUID> {
    Optional<MiPiace> findById(UUID likeId);
    Optional<MiPiace> findByUserAndPost(User user, Post post);
}
