package br.edu.fatec.api.flowtrack.config;

import br.edu.fatec.api.flowtrack.entity.Usuario;
import br.edu.fatec.api.flowtrack.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepo;

    @Override
    public void run(String... args) {
        seedUsuarios();
        System.out.println("Seeds carregados com sucesso.");
    }

    private void seedUsuarios() {
        if (usuarioRepo.findByMatricula("ADMIN001").isEmpty())
            usuarioRepo.save(Usuario.builder()
                    .nome("Administrador")
                    .matricula("ADMIN001")
                    .senha("admin123")
                    .isAdmin(true)
                    .ativo(true)
                    .primeiroAcesso(false)
                    .createdAt(LocalDateTime.now())
                    .build());

        if (usuarioRepo.findByMatricula("TEC001").isEmpty())
            usuarioRepo.save(Usuario.builder()
                    .nome("Técnico")
                    .matricula("TEC001")
                    .senha("tec123")
                    .isAdmin(false)
                    .ativo(true)
                    .primeiroAcesso(false)
                    .createdAt(LocalDateTime.now())
                    .build());
    }
}