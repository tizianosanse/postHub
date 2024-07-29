package tizianosanseverino.PostHub.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tizianosanseverino.PostHub.entities.Comment;
import tizianosanseverino.PostHub.entities.Post;

import tizianosanseverino.PostHub.entities.User;
import tizianosanseverino.PostHub.exceptions.NotFoundException;
import tizianosanseverino.PostHub.payloads.NewCommentDTO;
import tizianosanseverino.PostHub.payloads.NewPostDTO;
import tizianosanseverino.PostHub.repositories.CommentsRepository;
import tizianosanseverino.PostHub.repositories.PostsRepository;
import tizianosanseverino.PostHub.repositories.UsersRepository;


import java.util.UUID;

@Service
public class CommentsService {
    @Autowired
    PostsRepository postsRepository;
    @Autowired
    CommentsRepository commentsRepository;
    @Autowired
    UsersRepository usersRepository;

    public Page<Comment> getComments(int pageNumber, int pageSize, String sortBy) {
        if (pageSize > 100) pageSize = 100;
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy));
        return commentsRepository.findAll(pageable);
    }


    public Comment createComment(NewCommentDTO body,UUID postId,UUID userId) {
        User user= usersRepository.findById(userId).orElseThrow(()->new NotFoundException("id dello user non trovato"));
        Post post= postsRepository.findById(postId).orElseThrow( ()-> new NotFoundException("post con id " + postId + " non trovato!"));
        Comment comment = new Comment(body.content());
        comment.setUser(user);
        comment.setPost(post);
        return commentsRepository.save(comment);
    }

    public Comment findById(UUID commentId) {
        return commentsRepository.findById(commentId).orElseThrow(() -> new NotFoundException(commentId));
    }


    public void findByIdAndDelete(UUID commentId) {
        Comment found = this.findById(commentId);
        this.commentsRepository.delete(found);
    }
    public Comment findByIdAndUpdate(UUID commentId, NewCommentDTO commUp){
       Comment comment = this.findById(commentId);
        comment.setContent(commUp.content());
        return commentsRepository.save(comment);
    }
}
