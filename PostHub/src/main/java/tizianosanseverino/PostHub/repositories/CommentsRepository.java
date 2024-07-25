package tizianosanseverino.PostHub.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tizianosanseverino.PostHub.entities.Comment;
import tizianosanseverino.PostHub.entities.Post;
import tizianosanseverino.PostHub.entities.User;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommentsRepository extends JpaRepository<Comment, UUID> {

}