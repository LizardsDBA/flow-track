package br.edu.fatec.api.flowtrack.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tipo_combustivel")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoCombustivel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String nome;

    @Column(nullable = false)
    private Boolean ativo;

    @PrePersist
    void prePersist() {
        if (ativo == null) ativo = true;
    }
}
