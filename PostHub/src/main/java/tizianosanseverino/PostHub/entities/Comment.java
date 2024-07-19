package tizianosanseverino.PostHub.entities;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "comments")
@NoArgsConstructor
@ToString
@Getter
@Setter
public class Comment {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    private String content;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Comment(String content, Timestamp createdAt, Timestamp updatedAt) {
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
