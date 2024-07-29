package tizianosanseverino.PostHub.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tizianosanseverino.PostHub.entities.Comment;
import tizianosanseverino.PostHub.entities.MiPiace;
import tizianosanseverino.PostHub.entities.Post;
import tizianosanseverino.PostHub.entities.User;
import tizianosanseverino.PostHub.exceptions.NotFoundException;
import tizianosanseverino.PostHub.payloads.NewCommentDTO;
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

    public Page<MiPiace> getLikes(int pageNumber, int pageSize, String sortBy) {
        if (pageSize > 100) pageSize = 100;
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy));
        return likesRepository.findAll(pageable);
    }



    public MiPiace addLike(NewLikeDTO body, UUID postId,UUID userId) {
        User user=usersRepository.findById(userId).orElseThrow(()->new NotFoundException("questo id e sbagliato"));
        Post post= postsRepository.findById(postId).orElseThrow( ()-> new NotFoundException("post con id " + postId + " non trovato!"));
        MiPiace like = new MiPiace(body.like());
        like.setUser(user);
        like.setPost(post);
        return likesRepository.save(like);
    }


    public MiPiace findById(UUID likeId) {
        return likesRepository.findById(likeId).orElseThrow(() -> new NotFoundException(likeId));
    }


    public void findByIdAndDelete(UUID likeId) {
        MiPiace found = this.findById(likeId);
        this.likesRepository.delete(found);
    }
    public MiPiace findByIdAndUpdate(UUID likeId, NewLikeDTO likeUp){
        MiPiace like = this.findById(likeId);
        like.setMi_piace(likeUp.like());
        return likesRepository.save(like);
    }
}
