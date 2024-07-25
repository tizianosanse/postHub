package tizianosanseverino.PostHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public User saveUser(@RequestBody @Validated NewUserDTO body, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new BadRequestException(validationResult.getAllErrors());
        }
        return usersService.save(body);
    }
}