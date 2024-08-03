package tizianosanseverino.PostHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tizianosanseverino.PostHub.entities.User;
import tizianosanseverino.PostHub.exceptions.BadRequestException;
import tizianosanseverino.PostHub.payloads.NewUserDTO;
import tizianosanseverino.PostHub.payloads.UserLoginDTO;
import tizianosanseverino.PostHub.payloads.UserLoginResponseDTO;
import tizianosanseverino.PostHub.security.JWTTools;
import tizianosanseverino.PostHub.services.AuthService;
import tizianosanseverino.PostHub.services.UsersService;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UsersService usersService;

    @Autowired
    private JWTTools jwtTools;

    @PostMapping("/login")
    public UserLoginResponseDTO login(@RequestBody UserLoginDTO payload){
        return new UserLoginResponseDTO(authService.authenticateUserAndGenerateToken(payload));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User saveUser(@RequestBody @Validated NewUserDTO body) {

        return usersService.save(body);
    }



    @GetMapping("/current-user-id")
    public ResponseEntity<UUID> getCurrentUserId() {
        // Ottieni l'oggetto Authentication dal contesto di sicurezza
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            UUID userId = currentUser.getId(); // Assumi che User abbia un metodo getId() che restituisce l'UUID dell'utente
            return ResponseEntity.ok(userId);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


}