package br.edu.fatec.api.flowtrack.repository;

import br.edu.fatec.api.flowtrack.entity.Viatura;
import br.edu.fatec.api.flowtrack.entity.Viatura.StatusViatura;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ViaturaRepository extends JpaRepository<Viatura, Integer> {
    Optional<Viatura> findByPrefixo(String prefixo);
    List<Viatura> findByAtivoTrue();
    List<Viatura> findByStatusAndAtivoTrue(StatusViatura status);
}