package tizianosanseverino.PostHub.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tizianosanseverino.PostHub.entities.User;
import tizianosanseverino.PostHub.exceptions.UnauthorizedException;
import tizianosanseverino.PostHub.payloads.UserLoginDTO;
import tizianosanseverino.PostHub.security.JWTTools;

@Service
public class AuthService {

    @Autowired
    private UsersService usersService;

    @Autowired
    private PasswordEncoder bcrypt;

    @Autowired
    private JWTTools jwtTools;


    public String authenticateUserAndGenerateToken(UserLoginDTO payload){

        User user = usersService.findByEmail(payload.email());
        if(bcrypt.matches(payload.password(), user.getPassword())){
            return jwtTools.createToken(user);
        } else {
            throw new UnauthorizedException("Your credentials are incorrect!");
        }
    }
}