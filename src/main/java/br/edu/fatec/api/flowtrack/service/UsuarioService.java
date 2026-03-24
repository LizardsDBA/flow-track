package br.edu.fatec.api.flowtrack.service;

import br.edu.fatec.api.flowtrack.dto.Dtos.*;
import br.edu.fatec.api.flowtrack.entity.Usuario;
import br.edu.fatec.api.flowtrack.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repo;

    public LoginResponse login(LoginRequest req) {
        var u = repo.findByMatricula(req.matricula())
                .filter(user -> Boolean.TRUE.equals(user.getAtivo()))
                .orElseThrow(() -> new RuntimeException("Matrícula ou senha inválidos."));

        if (!req.senha().equals(u.getSenha())) {
            throw new RuntimeException("Matrícula ou senha inválidos.");
        }

        return new LoginResponse(u.getId(), u.getNome(), u.getMatricula(), u.getIsAdmin(), u.getPrimeiroAcesso());
    }

    public void trocarSenha(TrocarSenhaRequest req) {
        var u = repo.findById(req.id()).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (!req.senhaAtual().equals(u.getSenha())) {
            throw new RuntimeException("Senha atual incorreta.");
        }
        if (req.novaSenha() == null || req.novaSenha().isBlank()) {
            throw new RuntimeException("A nova senha não pode ser vazia.");
        }

        u.setSenha(req.novaSenha());
        u.setPrimeiroAcesso(false);
        repo.save(u);
    }

    public List<UsuarioResponse> listar() {
        return repo.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public UsuarioResponse criar(UsuarioRequest req) {
        if (repo.findByMatricula(req.matricula()).isPresent()) {
            throw new RuntimeException("Matrícula já cadastrada.");
        }
        var u = Usuario.builder()
                .nome(req.nome())
                .matricula(req.matricula())
                .senha(req.senha())
                .isAdmin(req.isAdmin() != null && req.isAdmin())
                .ativo(true)
                .primeiroAcesso(true)
                .createdAt(LocalDateTime.now())
                .build();
        return toResponse(repo.save(u));
    }

    public UsuarioResponse atualizar(Integer id, UsuarioRequest req) {
        var u = repo.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        u.setNome(req.nome());
        u.setIsAdmin(req.isAdmin() != null && req.isAdmin());
        if (req.senha() != null && !req.senha().isBlank()) {
            u.setSenha(req.senha());
            u.setPrimeiroAcesso(true);
        }
        return toResponse(repo.save(u));
    }

    public void desativar(Integer id) {
        var u = repo.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        u.setAtivo(false);
        repo.save(u);
    }

    private UsuarioResponse toResponse(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getMatricula(), u.getIsAdmin(), u.getAtivo());
    }
}