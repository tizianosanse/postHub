package tizianosanseverino.PostHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import tizianosanseverino.PostHub.entities.MiPiace;

import tizianosanseverino.PostHub.payloads.NewLikeDTO;
import tizianosanseverino.PostHub.services.LikesService;
import java.util.UUID;

@RestController
@RequestMapping("/likes")
public class LikesController {
    @Autowired
    private LikesService likesService;
    @GetMapping
    public Page<MiPiace> getAllLikes(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy) {
        return likesService.getLikes(page, size, sortBy);
    }
    @PostMapping("{userId}/{postId}")
    @ResponseStatus(HttpStatus.CREATED)
    public MiPiace save(@PathVariable UUID postId,@PathVariable UUID userId, @RequestBody @Validated NewLikeDTO body) {
        return likesService.addLike(body, postId,userId);
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
