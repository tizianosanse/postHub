package tizianosanseverino.PostHub.payloads;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record NewCommentDTO(@NotEmpty(message = "Il contenuto del commento è un dato obbligatorio!")
                            @Size(min = 3, max = 40, message = "Il contenuto del commento deve essere compreso tra i 3 ed i 40 caratteri!")
                            String content) {
}
