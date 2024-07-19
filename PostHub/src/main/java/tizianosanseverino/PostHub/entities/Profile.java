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

    public Profile(String bios, User utente, String avatar_url) {
        this.bios = bios;
        this.utente = utente;
        this.avatar_url = avatar_url;
    }
}
