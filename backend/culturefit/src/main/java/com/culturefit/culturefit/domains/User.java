package com.culturefit.culturefit.domains;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Usuario del sistema")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único del usuario", example = "1")
    private Long id;

    @Column(nullable = false, unique = true)
    @Size(min = 9, max = 9)
    @NotBlank
    @Schema(description = "DNI del usuario (9 caracteres)", example = "12345678A")
    private String dni;

    @Column(nullable = false, unique = true)
    @Size(min = 3, max = 20)
    @NotBlank
    @Schema(description = "Nombre del usuario", example = "Juan Pérez")
    private String name;

    @Column(nullable = false, unique = true)
    @Size(max = 50)
    @Email(message = "The email must be valid")
    @NotBlank
    @Schema(description = "Correo electrónico del usuario", example = "juan.perez@example.com")
    private String email;

    @Column(nullable = false)
    // @Schema(description = "Contraseña del usuario (6-40 caracteres)", example = "password123")
    // @NotBlank(message = "El correo electrónico debe ser válido")
    // @Size(min = 6, max = 300)
    private String password;

    @NotNull
    @Schema(description = "Fecha de nacimiento del usuario", example = "1990-01-01")
    private LocalDate birthDate;

    @Schema(description = "Indica si el usuario está activo", example = "true")
    private boolean active = false;

    @Schema(description = "URL de la imagen de perfil del usuario", example = "https://example.com/profile.jpg")
    private String imageUrl;

    @Column(nullable = false)
    @Schema(description = "Rol del usuario en el sistema", example = "USER")
    private Role role;

    @Schema(description = "Número de citas disponibles para el usuario", example = "5")
    private int appointmentsAvailables = 0;

    @Column(unique = true)
    @Schema(description = "ID de cliente en Stripe", example = "cus_123456789")
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
    @Schema(description = "Lista de amigos del usuario")
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
    @Schema(description = "Solicitudes de amistad recibidas")
    private Set<User> friendRequestsReceived = new HashSet<>();
}
