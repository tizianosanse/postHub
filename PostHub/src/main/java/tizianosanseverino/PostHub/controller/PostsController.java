package tizianosanseverino.PostHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tizianosanseverino.PostHub.entities.Post;
import tizianosanseverino.PostHub.payloads.NewPostDTO;
import tizianosanseverino.PostHub.services.PostsService;

import java.util.UUID;

@RestController
@RequestMapping("/posts")
public class PostsController {
    @Autowired
    private PostsService postService;

    @PostMapping("/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Post save(@PathVariable UUID userId, @RequestBody @Validated NewPostDTO body) {
        return postService.createPost(body, userId);
    }
}
