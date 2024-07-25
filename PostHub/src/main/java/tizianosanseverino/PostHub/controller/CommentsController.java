package tizianosanseverino.PostHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tizianosanseverino.PostHub.entities.Comment;

import tizianosanseverino.PostHub.payloads.NewCommentDTO;

import tizianosanseverino.PostHub.services.CommentsService;


import java.util.UUID;

@RestController
@RequestMapping("/comments")
public class CommentsController {
    @Autowired
    private CommentsService commentsService;

    @PostMapping("/{userId}/{postId}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('USER')")
    public Comment save(@PathVariable UUID postId,@PathVariable UUID userId, @RequestBody @Validated NewCommentDTO body) {
        return commentsService.createComment(body, postId,userId);
    }
}
