package tizianosanseverino.PostHub.entities;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "messages")
@NoArgsConstructor
@ToString
@Getter
@Setter
public class Messagge {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;
    private String content;
    private Timestamp createdAt;
    private Timestamp readAt;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;


    public Messagge(Timestamp createdAt, String content, Timestamp readAt) {
        this.createdAt = createdAt;
        this.content = content;
        this.readAt = readAt;
    }
}
