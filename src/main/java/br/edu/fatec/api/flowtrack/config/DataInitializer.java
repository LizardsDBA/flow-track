package br.edu.fatec.api.flowtrack.config;

import br.edu.fatec.api.flowtrack.entity.TipoCombustivel;
import br.edu.fatec.api.flowtrack.entity.Usuario;
import br.edu.fatec.api.flowtrack.entity.Viatura;
import br.edu.fatec.api.flowtrack.entity.Viatura.StatusViatura;
import br.edu.fatec.api.flowtrack.entity.Viatura.TipoViatura;
import br.edu.fatec.api.flowtrack.repository.TipoCombustivelRepository;
import br.edu.fatec.api.flowtrack.repository.UsuarioRepository;
import br.edu.fatec.api.flowtrack.repository.ViaturaRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepo;
    private final ViaturaRepository viaturaRepo;
    private final TipoCombustivelRepository tipoCombustivelRepo;

    @Override
    public void run(String... args) {
        seedUsuarios();
        seedViaturas();
        seedTiposCombustivel();
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

        if (usuarioRepo.findByMatricula("a1").isEmpty())
            usuarioRepo.save(Usuario.builder()
                    .nome("A1")
                    .matricula("a1")
                    .senha("a1")
                    .isAdmin(true)
                    .ativo(true)
                    .primeiroAcesso(false)
                    .createdAt(LocalDateTime.now())
                    .build());

        if (usuarioRepo.findByMatricula("t1").isEmpty())
            usuarioRepo.save(Usuario.builder()
                    .nome("t1")
                    .matricula("t1")
                    .senha("t1")
                    .isAdmin(false)
                    .ativo(true)
                    .primeiroAcesso(false)
                    .createdAt(LocalDateTime.now())
                    .build());
    }

    private void seedViaturas() {
        record V(String pfx, String placa, String marca, String modelo, int ano, TipoViatura tipo, int km) {
        }
        for (var v : List.of(
                new V("SJC-01", "BRA2E19", "Volkswagen", "Gol", 2020, TipoViatura.UTILITARIO, 45200),
                new V("SJC-02", "RJN4H12", "Fiat", "Strada", 2021, TipoViatura.UTILITARIO, 12800),
                new V("SJC-03", "KLD8I34", "Chevrolet", "Spin", 2022, TipoViatura.PASSEIO, 22150),
                new V("SJC-04", "POT1A56", "Toyota", "Hilux", 2019, TipoViatura.UTILITARIO, 89300),
                new V("SJC-05", "ABC4D56", "Volkswagen", "Saveiro", 2020, TipoViatura.UTILITARIO, 34000))) {
            if (viaturaRepo.findByPrefixo(v.pfx()).isEmpty())
                viaturaRepo.save(Viatura.builder()
                        .prefixo(v.pfx()).placa(v.placa()).marca(v.marca()).modelo(v.modelo())
                        .ano(v.ano()).tipo(v.tipo()).status(StatusViatura.DISPONIVEL)
                        .kmAtual(v.km()).ativo(true).createdAt(LocalDateTime.now()).build());
        }
    }

    private void seedTiposCombustivel() {
        for (String nome : List.of("Gasolina", "Etanol", "Diesel", "GNV")) {
            if (!tipoCombustivelRepo.existsByNomeIgnoreCase(nome)) {
                tipoCombustivelRepo.save(TipoCombustivel.builder()
                        .nome(nome)
                        .ativo(true)
                        .build());
            }
        }
    }
}