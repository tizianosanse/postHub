package tizianosanseverino.PostHub.payloads;

import jakarta.validation.constraints.NotNull;

public record NewLikeDTO(
        Boolean like
) {
}
