package com.culturefit.culturefit.domains;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @Size(min = 9, max = 9)
    @NotBlank
    private String dni;

    @Column(nullable = false, unique = true)
    @Size(min = 3, max = 20)
    @NotBlank
    private String name;

    @Column(nullable = false, unique = true)
    @Size(max = 50)
    @Email(message = "The email must be valid")
    @NotBlank
    private String email;

    @Column(nullable = false)

    // @Schema(description = "Contraseña del usuario (6-40 caracteres)", example = "password123")
    // @NotBlank(message = "El correo electrónico debe ser válido")
    // @Size(min = 6, max = 300)
    private String password;

    @NotNull
    private LocalDate birthDate;

    private boolean active = false;

    private String imageUrl;

    @Column(nullable = false)
    private Role role;

    private int appointmentsAvailables = 0;

    @Column(unique = true)
    private String stripeId;

    @Schema(description = "Tipo de membresía que tiene el usuario", example = "BASIC")
    private MembershipEnum membership;

    private LocalDate lastPaymentDate;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany
    @JoinTable(
        name = "user_friends",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    @JsonIgnore
    private Set<User> friendList;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany
    @JoinTable(
        name = "friend_requests",
        joinColumns = @JoinColumn(name = "receiver_id"),
        inverseJoinColumns = @JoinColumn(name = "sender_id")
    )
    @JsonIgnore
    private Set<User> friendRequestsReceived;
}
