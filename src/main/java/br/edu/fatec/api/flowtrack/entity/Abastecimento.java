package br.edu.fatec.api.flowtrack.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "abastecimento")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Abastecimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // os_id nullable — abastecimento pode ocorrer fora de uma OS
    @Column(name = "os_id", nullable = true)
    private Integer osId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "viatura_id", nullable = false)
    private Viatura viatura;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Valores possíveis: gasolina | etanol | diesel | gnv
    @Column(nullable = false, length = 20)
    private String tipoCombustivel;

    @Column(nullable = false, precision = 8, scale = 3)
    private BigDecimal litros;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(nullable = false)
    private Integer kmAbastecimento;

    @Column(length = 50)
    private String numeroNf;

    @Column(nullable = false)
    private LocalDateTime dataAbastecimento;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] comprovante;

    @Column(length = 50)
    private String comprovanteTipo;

    @PrePersist
    void prePersist() {
        if (dataAbastecimento == null) dataAbastecimento = LocalDateTime.now();
    }
}
