package tizianosanseverino.PostHub.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tizianosanseverino.PostHub.entities.Comment;
import tizianosanseverino.PostHub.entities.Post;

import tizianosanseverino.PostHub.entities.User;
import tizianosanseverino.PostHub.exceptions.NotFoundException;
import tizianosanseverino.PostHub.payloads.NewCommentDTO;
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

    public Comment createComment(NewCommentDTO body,UUID postId,UUID userId) {
        User user= usersRepository.findById(userId).orElseThrow(()->new NotFoundException("id dello user non trovato"));
        Post post= postsRepository.findById(postId).orElseThrow( ()-> new NotFoundException("post con id " + postId + " non trovato!"));
        Comment comment = new Comment(body.content());
        comment.setUser(user);
        comment.setPost(post);
        return commentsRepository.save(comment);
    }
}
