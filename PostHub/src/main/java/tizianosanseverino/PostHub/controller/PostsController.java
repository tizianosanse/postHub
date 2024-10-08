package tizianosanseverino.PostHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tizianosanseverino.PostHub.entities.Comment;
import tizianosanseverino.PostHub.entities.MiPiace;
import tizianosanseverino.PostHub.entities.Post;
import tizianosanseverino.PostHub.entities.User;
import tizianosanseverino.PostHub.payloads.NewPostDTO;
import tizianosanseverino.PostHub.payloads.NewUserDTO;
import tizianosanseverino.PostHub.services.PostsService;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/posts")
public class PostsController {
    @Autowired
    private PostsService postService;

    @GetMapping
    public Page<Post> getAllPosts(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "50") int size, @RequestParam(defaultValue = "id") String sortBy) {
        return postService.getPosts(page, size, sortBy);
    }
    @GetMapping("/{postId}/comment")
    public Set<Comment> getCommentPosts(@PathVariable UUID postId){
        return postService.getCommentPosts(postId);
    }
    @GetMapping("/{postId}/like")
    public Set<MiPiace> getLikePosts(@PathVariable UUID postId){
        return postService.getLikePosts(postId);
    }

    @PostMapping("/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Post save(@PathVariable UUID userId, @RequestBody @Validated NewPostDTO body) {
        return postService.createPost(body, userId);
    }
    @PutMapping("/{postId}")
    public Post findByIdAndUpdate(@PathVariable UUID postId, @RequestBody NewPostDTO body) {
        return postService.findByIdAndUpdate(postId, body);
    }

    @GetMapping("/{postId}")
    public Post findById(@PathVariable UUID postId) {
        return this.postService.findById(postId);
    }

    @DeleteMapping("/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void findByIdAndDelete(@PathVariable UUID postId) {
        this.postService.findByIdAndDelete(postId);
    }

    @GetMapping("/{postId}/profile")
    public User getMyUser(@PathVariable UUID postId){
        return postService.getMyUser(postId);
    }

}
