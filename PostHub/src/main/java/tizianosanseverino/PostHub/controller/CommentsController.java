package tizianosanseverino.PostHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tizianosanseverino.PostHub.entities.Comment;

import tizianosanseverino.PostHub.entities.Post;
import tizianosanseverino.PostHub.payloads.NewCommentDTO;

import tizianosanseverino.PostHub.payloads.NewPostDTO;
import tizianosanseverino.PostHub.services.CommentsService;


import java.util.UUID;

@RestController
@RequestMapping("/comments")
public class CommentsController {
    @Autowired
    private CommentsService commentsService;
    @GetMapping
    public Page<Comment> getAllComments(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy) {
        return commentsService.getComments(page, size, sortBy);
    }
    @PostMapping("/{userId}/{postId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Comment save(@PathVariable UUID postId,@PathVariable UUID userId, @RequestBody @Validated NewCommentDTO body) {
        return commentsService.createComment(body, postId,userId);
    }


    @PutMapping("/{commentId}")
    public Comment findByIdAndUpdate(@PathVariable UUID commentId, @RequestBody NewCommentDTO body) {
        return commentsService.findByIdAndUpdate(commentId, body);
    }

    @GetMapping("/{commentId}")
    public Comment findById(@PathVariable UUID commentId) {
        return this.commentsService.findById(commentId);
    }
    @DeleteMapping("/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void findByIdAndDelete(@PathVariable UUID commentId) {
        this.commentsService.findByIdAndDelete(commentId);
    }

}
