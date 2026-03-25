package br.edu.fatec.api.flowtrack.repository;

import br.edu.fatec.api.flowtrack.entity.TipoCombustivel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TipoCombustivelRepository extends JpaRepository<TipoCombustivel, Integer> {
    List<TipoCombustivel> findByAtivoTrue();
    boolean existsByNomeIgnoreCase(String nome);
}
