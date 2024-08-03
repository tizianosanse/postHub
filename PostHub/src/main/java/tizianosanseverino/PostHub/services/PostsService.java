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
import tizianosanseverino.PostHub.payloads.NewPostDTO;
import tizianosanseverino.PostHub.repositories.PostsRepository;
import tizianosanseverino.PostHub.repositories.UsersRepository;


import java.util.Set;
import java.util.UUID;


@Service
public class PostsService {
    @Autowired
    PostsRepository postsRepository;
    @Autowired
    UsersRepository usersRepository;

    public Page<Post> getPosts(int pageNumber, int pageSize, String sortBy) {
        if (pageSize > 100) pageSize = 100;
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy));
        return postsRepository.findAll(pageable);
    }

    public Post createPost(NewPostDTO body, UUID userId) {
        User user = usersRepository.findById(userId).orElseThrow(() -> new NotFoundException("Utente con username " + userId + " non trovato!"));
        Post post = new Post(body.content());
        post.setUser(user);
        return postsRepository.save(post);
    }

    public Post findById(UUID postId) {
        return postsRepository.findById(postId).orElseThrow(() -> new NotFoundException(postId));
    }
    public Set<Comment> getCommentPosts(UUID postId){
        Post post = postsRepository.findById(postId).orElseThrow(()-> new NotFoundException(postId));
        return post.getCommenti();
      }
    public Set<MiPiace> getLikePosts(UUID postId){
        Post post = postsRepository.findById(postId).orElseThrow(()-> new NotFoundException(postId));
        return post.getMi_piace();
    }

    public void findByIdAndDelete(UUID postId) {
        Post found = this.findById(postId);
        this.postsRepository.delete(found);
    }
    public Post findByIdAndUpdate(UUID postId,NewPostDTO postUp){
        Post post = this.findById(postId);
        post.setContent(postUp.content());
        return postsRepository.save(post);
    }
    public User getMyUser(UUID postId){
        Post post = postsRepository.findById(postId).orElseThrow(()-> new NotFoundException(postId));
        return post.getUser();
    }
}
