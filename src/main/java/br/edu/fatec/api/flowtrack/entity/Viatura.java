package br.edu.fatec.api.flowtrack.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "viatura")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Viatura {

    public enum TipoViatura { UTILITARIO, PASSEIO }
    public enum StatusViatura { DISPONIVEL, EM_USO, INDISPONIVEL }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 20)
    private String prefixo;

    @Column(nullable = false, unique = true, length = 10)
    private String placa;

    @Column(nullable = false, length = 50)
    private String marca;

    @Column(nullable = false, length = 50)
    private String modelo;

    @Column(nullable = false)
    private Integer ano;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoViatura tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusViatura status;

    @Column(nullable = false)
    private Integer kmAtual;

    @Column(nullable = false)
    private Boolean ativo;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (ativo == null) ativo = true;
        if (status == null) status = StatusViatura.DISPONIVEL;
        if (kmAtual == null) kmAtual = 0;
    }
}
