package tizianosanseverino.PostHub.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import tizianosanseverino.PostHub.entities.MiPiace;

import tizianosanseverino.PostHub.payloads.NewLikeDTO;
import tizianosanseverino.PostHub.services.LikesService;
import tizianosanseverino.PostHub.services.PostsService;
import tizianosanseverino.PostHub.services.UsersService;

import java.util.UUID;

@RestController
@RequestMapping("/likes")




public class LikesController {
    @Autowired
    private LikesService likesService;
    @Autowired
    private UsersService usersService;

    @Autowired
    private PostsService postService;

    @GetMapping
    public Page<MiPiace> getAllLikes(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy) {
        return likesService.getLikes(page, size, sortBy);
    }
    @PostMapping("/{userId}/{postId}")
    public ResponseEntity<?> toggleLike(
            @PathVariable UUID userId,
            @PathVariable UUID postId,
            @RequestBody @Valid NewLikeDTO body) {

        MiPiace like = likesService.toggleLike(userId, postId, body);

        if (like == null) {
            return ResponseEntity.ok().body("Like removed");
        } else {
            return ResponseEntity.ok().body(like);
        }
    }
    @PutMapping("/{likeId}")
    public MiPiace findByIdAndUpdate(@PathVariable UUID likeId, @RequestBody NewLikeDTO body) {
        return likesService.findByIdAndUpdate(likeId, body);
    }

    @GetMapping("/{likeId}")
    public MiPiace findById(@PathVariable UUID likeId) {
        return this.likesService.findById(likeId);
    }
    @DeleteMapping("/{likeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void findByIdAndDelete(@PathVariable UUID likeId) {
        this.likesService.findByIdAndDelete(likeId);
    }



}
