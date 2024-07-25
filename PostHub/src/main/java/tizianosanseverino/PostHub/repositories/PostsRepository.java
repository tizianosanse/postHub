package tizianosanseverino.PostHub.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tizianosanseverino.PostHub.entities.Post;
import tizianosanseverino.PostHub.entities.Role;
import tizianosanseverino.PostHub.entities.User;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostsRepository extends JpaRepository<Post, UUID> {
Optional<Post> findById(UUID postId);
}
