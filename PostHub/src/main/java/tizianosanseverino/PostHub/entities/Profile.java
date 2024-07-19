package tizianosanseverino.PostHub.entities;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "profiles")
@NoArgsConstructor
@ToString
@Getter
@Setter
public class Profile {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;
    @Column(name = "bios")
    private String bios;
    @Column(name = "avatar_url")
    private String avatar_url;
    @Column(name = "created_at")
    private Timestamp created_at;
    @Column(name = "updated_at")
    private Timestamp updated_at;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User utente;
    public Profile(String bios, String avatar_url, Timestamp created_at, Timestamp updated_at) {
        this.bios = bios;
        this.avatar_url = avatar_url;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
