package tizianosanseverino.PostHub.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tizianosanseverino.PostHub.entities.MiPiace;
import tizianosanseverino.PostHub.entities.Post;
import tizianosanseverino.PostHub.entities.User;
import tizianosanseverino.PostHub.exceptions.NotFoundException;
import tizianosanseverino.PostHub.payloads.NewLikeDTO;
import tizianosanseverino.PostHub.repositories.LikesRepository;
import tizianosanseverino.PostHub.repositories.PostsRepository;
import tizianosanseverino.PostHub.repositories.UsersRepository;

import java.util.UUID;

@Service
public class LikesService {
    @Autowired
    PostsRepository postsRepository;
    @Autowired
    LikesRepository likesRepository;
    @Autowired
    UsersRepository usersRepository;

    public MiPiace addLike(NewLikeDTO body, UUID postId,UUID userId) {
        User user=usersRepository.findById(userId).orElseThrow(()->new NotFoundException("questo id e sbagliato"));
        Post post= postsRepository.findById(postId).orElseThrow( ()-> new NotFoundException("post con id " + postId + " non trovato!"));
        MiPiace like = new MiPiace(body.like());
        like.setUser(user);
        like.setPost(post);
        return likesRepository.save(like);
    }
}
