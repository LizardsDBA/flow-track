package br.edu.fatec.api.flowtrack.repository;

import br.edu.fatec.api.flowtrack.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByMatricula(String matricula);
}