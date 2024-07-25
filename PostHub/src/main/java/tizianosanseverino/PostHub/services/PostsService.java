package tizianosanseverino.PostHub.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tizianosanseverino.PostHub.entities.Post;
import tizianosanseverino.PostHub.entities.User;
import tizianosanseverino.PostHub.exceptions.NotFoundException;
import tizianosanseverino.PostHub.payloads.NewPostDTO;
import tizianosanseverino.PostHub.repositories.PostsRepository;
import tizianosanseverino.PostHub.repositories.UsersRepository;

import java.util.UUID;


@Service
public class PostsService {
    @Autowired
    PostsRepository postsRepository;
    @Autowired
    UsersRepository usersRepository;


    public Post createPost(NewPostDTO body, UUID userId) {
        User user = usersRepository.findById(userId).orElseThrow(() -> new NotFoundException("Utente con username " + userId + " non trovato!"));
        Post post = new Post(body.content());
        post.setUser(user);
        return postsRepository.save(post);
    }
}
