package tizianosanseverino.PostHub.payloads;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import tizianosanseverino.PostHub.entities.User;

public record NewPostDTO(
        @NotEmpty(message = "Il contenuto del post è un dato obbligatorio!")
        @Size(min = 3, max = 40, message = "Il contenuto del post deve essere compreso tra i 3 ed i 40 caratteri!")
        String content
) {
}
