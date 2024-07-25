package tizianosanseverino.PostHub.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "mi_piace")
@NoArgsConstructor
@ToString
@Getter
@Setter
public class MiPiace {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;
    boolean mi_piace;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    private User user;

    public MiPiace(boolean mi_piace) {
    this.mi_piace=mi_piace;    }
}
