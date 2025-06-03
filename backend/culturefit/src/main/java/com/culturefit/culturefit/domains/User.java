package com.culturefit.culturefit.domains;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Entity
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
    @Size(min = 6, max = 40)
    @NotBlank(message = "El correo electrónico debe ser válido")
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
    private Set<User> friendList = new HashSet<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany
    @JoinTable(
        name = "friend_requests",
        joinColumns = @JoinColumn(name = "receiver_id"),
        inverseJoinColumns = @JoinColumn(name = "sender_id")
    )
    @JsonIgnore
    private Set<User> friendRequestsReceived = new HashSet<>();
}
