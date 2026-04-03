package br.edu.fatec.api.flowtrack.service;

import br.edu.fatec.api.flowtrack.dto.Dtos.*;
import br.edu.fatec.api.flowtrack.entity.Abastecimento;
import br.edu.fatec.api.flowtrack.repository.AbastecimentoRepository;
import br.edu.fatec.api.flowtrack.repository.UsuarioRepository;
import br.edu.fatec.api.flowtrack.repository.ViaturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AbastecimentoService {

    private final AbastecimentoRepository repo;
    private final ViaturaRepository       viaturaRepo;
    private final UsuarioRepository       usuarioRepo;

    public List<AbastecimentoResponse> listar() {
        return repo.findAllByOrderByDataAbastecimentoDesc()
                   .stream().map(this::toResponse).toList();
    }

    /**
     * Registra abastecimento avulso (sem vínculo com OS).
     * osId é aceito e armazenado como referência, mas não validado
     * pois o módulo de OS ainda não está implementado neste serviço.
     */
    public AbastecimentoResponse registrar(
            Integer osId,
            Integer viaturaId,
            Integer usuarioId,
            String  tipoCombustivel,
            BigDecimal litros,
            BigDecimal valorTotal,
            Integer kmAbastecimento,
            String  numeroNf,
            String  observacao,
            MultipartFile comprovante
    ) {
        var viatura = viaturaRepo.findById(viaturaId)
                .orElseThrow(() -> new RuntimeException("Viatura não encontrada."));

        Integer kmInicial = viatura.getKmAtual();
        Integer kmAtual = repo.findMaxKmByViaturaId(viaturaId);

        Integer kmReferencia = Math.max(kmInicial, kmAtual);

        if (kmAbastecimento < kmReferencia) {
            throw new RuntimeException(
                    "KM deve ser maior quer o Km atual da viatura"
            );
        }

        var usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        var builder = Abastecimento.builder()
                .osId(osId)
                .viatura(viatura)
                .usuario(usuario)
                .tipoCombustivel(tipoCombustivel.toLowerCase())
                .litros(litros)
                .valorTotal(valorTotal)
                .kmAbastecimento(kmAbastecimento)
                .numeroNf(numeroNf)
                .observacao(observacao)
                .dataAbastecimento(LocalDateTime.now());

        if (comprovante != null && !comprovante.isEmpty()) {
            try {
                builder.comprovante(comprovante.getBytes())
                       .comprovanteTipo(comprovante.getContentType());
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar comprovante.");
            }
        }


        return toResponse(repo.save(builder.build()));
    }

    public byte[] getComprovante(Integer id) {
        return repo.findById(id)
                .map(Abastecimento::getComprovante)
                .orElseThrow(() -> new RuntimeException("Abastecimento não encontrado."));
    }

    public String getComprovanteTipo(Integer id) {
        return repo.findById(id)
                .map(Abastecimento::getComprovanteTipo)
                .orElse("image/jpeg");
    }

    public DashboardResponse getDashboard(long totalViaturas, long viaturasAtivas,
                                           long osAbertas, long totalTecnicos) {
        var gastoComb  = repo.totalGasto();
        var gastoDesp  = BigDecimal.ZERO; // módulo de despesas será integrado no Sprint 2
        return new DashboardResponse(
                totalViaturas, viaturasAtivas, osAbertas,
                repo.totalRegistros(),
                gastoComb, gastoDesp,
                gastoComb,
                repo.totalLitros(), totalTecnicos
        );
    }

    private AbastecimentoResponse toResponse(Abastecimento a) {
        return new AbastecimentoResponse(
                a.getId(),
                a.getOsId(),
                a.getViatura().getPrefixo(),
                a.getViatura().getPlaca(),
                a.getViatura().getMarca() + " " + a.getViatura().getModelo(),
                a.getUsuario().getNome(),
                a.getUsuario().getMatricula(),
                a.getTipoCombustivel(),
                a.getLitros(), a.getValorTotal(),
                a.getKmAbastecimento(), a.getNumeroNf(),
                a.getDataAbastecimento(), a.getObservacao(),
                a.getComprovante() != null && a.getComprovante().length > 0
        );
    }
}
