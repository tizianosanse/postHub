package tizianosanseverino.PostHub.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@NoArgsConstructor
@ToString
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;
    @Column(name = "name")
    private String name;
    @Column(name = "surname")
    private String surname;
    @Column(name = "birthday")
    private Date birthday;
     @Column(name = "username")
    private String username;
     @Column(name = "email")
    private String email;
     @Column(name = "password_hash")
    private String password;
     @Column(name = "created_at")
    private LocalDateTime created_at;
    @Column(name = "updated_at")
    private LocalDateTime updated_at;
    @OneToOne(mappedBy = "utente", cascade = CascadeType.ALL)
    private Profile profilo;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Post> posts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Comment> commenti;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Like> likes;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    private Set<Messagge> sentMessages;

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL)
    private Set<Messagge> receivedMessages;

    public User(Date birthday, String name, String surname, String username, String email, String password,  Profile profilo, Set<Post> posts, Set<Comment> commenti, Set<Like> likes, Set<Messagge> sentMessages, Set<Messagge> receivedMessages) {
        this.birthday = birthday;
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.email = email;
        this.password = password;
        this.profilo = profilo;
        this.posts = posts;
        this.commenti = commenti;
        this.likes = likes;
        this.sentMessages = sentMessages;
        this.receivedMessages = receivedMessages;
    }
}
