package tizianosanseverino.PostHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tizianosanseverino.PostHub.entities.User;
import tizianosanseverino.PostHub.payloads.NewUserDTO;
import tizianosanseverino.PostHub.services.PostsService;
import tizianosanseverino.PostHub.services.UsersService;

import java.io.IOException;

import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    private UsersService usersService;

    @Autowired
    private PostsService postService;


    @GetMapping
    public Page<User> getAllUsers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy) {
        return usersService.getUsers(page, size, sortBy);
    }

    @PutMapping("/{id}")
    public User findByIdAndUpdate(@PathVariable UUID id, @RequestBody NewUserDTO body) {
        return usersService.findByIdAndUpdate(id, body);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public User findById(@PathVariable UUID userId) {
        return this.usersService.findById(userId);
    }



    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void findByIdAndDelete(@PathVariable UUID userId) {
        this.usersService.findByIdAndDelete(userId);
    }

    @PostMapping("/{id}/avatar")
    public User uploadAvatar(@PathVariable UUID id, @RequestParam("avatar") MultipartFile image) throws IOException {
        String avatarURL = usersService.uploadAvatar(image);
        return usersService.updateAvatar(id, avatarURL);
    }

}