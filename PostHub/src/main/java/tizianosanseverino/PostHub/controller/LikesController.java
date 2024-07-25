package tizianosanseverino.PostHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("{userId}/{postId}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('USER')")
    public MiPiace save(@PathVariable UUID postId,@PathVariable UUID userId, @RequestBody @Validated NewLikeDTO body) {
        return likesService.addLike(body, postId,userId);
    }
}
