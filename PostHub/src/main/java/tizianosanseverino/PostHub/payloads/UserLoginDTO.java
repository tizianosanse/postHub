package tizianosanseverino.PostHub.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record UserLoginDTO(@Email(message = "L'email è obbligatoria!")
                           String email,
                           @NotEmpty(message = "La password è obbligatoria!")
                           String password) {
}
