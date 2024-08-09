package tizianosanseverino.PostHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tizianosanseverino.PostHub.entities.Comment;
import tizianosanseverino.PostHub.entities.Post;
import tizianosanseverino.PostHub.entities.User;
import tizianosanseverino.PostHub.payloads.NewUserDTO;
import tizianosanseverino.PostHub.services.PostsService;
import tizianosanseverino.PostHub.services.UsersService;

import java.io.IOException;

import java.util.Set;
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

    @PutMapping("/{userid}")
    public User findByIdAndUpdate(@PathVariable UUID userid, @RequestBody NewUserDTO body) {
        return usersService.findByIdAndUpdate(userid, body);
    }

    @GetMapping("/{userId}")
    public User findById(@PathVariable UUID userId) {
        return this.usersService.findById(userId);
    }



    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void findByIdAndDelete(@PathVariable UUID userId) {
        this.usersService.findByIdAndDelete(userId);
    }


    @GetMapping("/{userId}/posts")
    public Set<Post> getMyPosts(@PathVariable UUID userId){
        return usersService.getMyPosts(userId);
    }

    @PutMapping("/{userId}/avatar")
    public ResponseEntity<User> updateAvatar(@PathVariable UUID userId, @RequestBody String url) {
        User updatedUser = usersService.updateAvatar(userId, url);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/avatar/upload")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file) throws IOException {
        String url = usersService.uploadAvatar(file);
        return ResponseEntity.ok(url);
    }

}