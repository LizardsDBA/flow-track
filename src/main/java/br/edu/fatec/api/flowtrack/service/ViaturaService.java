package br.edu.fatec.api.flowtrack.service;

import br.edu.fatec.api.flowtrack.dto.Dtos.*;
import br.edu.fatec.api.flowtrack.entity.Viatura;
import br.edu.fatec.api.flowtrack.entity.Viatura.StatusViatura;
import br.edu.fatec.api.flowtrack.entity.Viatura.TipoViatura;
import br.edu.fatec.api.flowtrack.repository.ViaturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ViaturaService {

    private final ViaturaRepository repo;

    public List<ViaturaResponse> listar() {
        return repo.findByAtivoTrue().stream().map(this::toResponse).toList();
    }

    public List<ViaturaResponse> listarTodas() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public ViaturaResponse buscarPorId(Integer id) {
        return repo.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Viatura não encontrada."));
    }

    public ViaturaResponse criar(ViaturaRequest req) {
        var v = Viatura.builder()
                .prefixo(req.prefixo().toUpperCase())
                .placa(req.placa().toUpperCase())
                .marca(req.marca())
                .modelo(req.modelo())
                .ano(req.ano())
                .tipo(TipoViatura.valueOf(req.tipo().toUpperCase()))
                .status(StatusViatura.DISPONIVEL)
                .kmAtual(req.kmAtual() != null ? req.kmAtual() : 0)
                .ativo(true)
                .createdAt(LocalDateTime.now())
                .build();
        return toResponse(repo.save(v));
    }

    public ViaturaResponse atualizar(Integer id, ViaturaRequest req) {
        var v = repo.findById(id).orElseThrow(() -> new RuntimeException("Viatura não encontrada."));
        v.setPrefixo(req.prefixo().toUpperCase());
        v.setPlaca(req.placa().toUpperCase());
        v.setMarca(req.marca());
        v.setModelo(req.modelo());
        v.setAno(req.ano());
        v.setTipo(TipoViatura.valueOf(req.tipo().toUpperCase()));
        if (req.status() != null) {
            v.setStatus(StatusViatura.valueOf(req.status().toUpperCase()));
        }
        if (req.kmAtual() != null) {
            v.setKmAtual(req.kmAtual());
        }
        return toResponse(repo.save(v));
    }

    public void desativar(Integer id) {
        var v = repo.findById(id).orElseThrow(() -> new RuntimeException("Viatura não encontrada."));
        v.setAtivo(false);
        repo.save(v);
    }

    public ViaturaResponse toResponse(Viatura v) {
        return new ViaturaResponse(
                v.getId(), v.getPrefixo(), v.getPlaca(),
                v.getMarca(), v.getModelo(), v.getAno(),
                v.getTipo().name(), v.getStatus().name(),
                v.getKmAtual(), v.getAtivo()
        );
    }
}