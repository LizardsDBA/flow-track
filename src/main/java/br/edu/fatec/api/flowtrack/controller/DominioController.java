package br.edu.fatec.api.flowtrack.controller;

import br.edu.fatec.api.flowtrack.dto.Dtos.*;
import br.edu.fatec.api.flowtrack.entity.TipoCombustivel;
import br.edu.fatec.api.flowtrack.repository.TipoCombustivelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dominio")
@RequiredArgsConstructor
public class DominioController {

    private final TipoCombustivelRepository tipoCombustivelRepo;

    // ── Tipos de Combustível ─────────────────────────────────────────

    /** Retorna apenas os ativos — usado pelo dropdown do formulário de abastecimento */
    @GetMapping("/tipos-combustivel")
    public List<TipoCombustivelResponse> listarCombustiveisAtivos() {
        return tipoCombustivelRepo.findByAtivoTrue().stream()
                .map(t -> new TipoCombustivelResponse(t.getId(), t.getNome(), t.getAtivo()))
                .toList();
    }

    /** Retorna todos (ativos + inativos) — usado pela tela de gerenciamento admin */
    @GetMapping("/tipos-combustivel/todos")
    public List<TipoCombustivelResponse> listarTodosCombustiveis() {
        return tipoCombustivelRepo.findAll().stream()
                .map(t -> new TipoCombustivelResponse(t.getId(), t.getNome(), t.getAtivo()))
                .toList();
    }

    @PostMapping("/tipos-combustivel")
    public ResponseEntity<?> criarCombustivel(@RequestBody TipoCombustivelRequest req) {
        if (tipoCombustivelRepo.existsByNomeIgnoreCase(req.nome()))
            return ResponseEntity.badRequest().body("Tipo de combustível já cadastrado.");
        var saved = tipoCombustivelRepo.save(
                TipoCombustivel.builder().nome(req.nome()).ativo(true).build());
        return ResponseEntity.ok(new TipoCombustivelResponse(saved.getId(), saved.getNome(), saved.getAtivo()));
    }

    @PutMapping("/tipos-combustivel/{id}")
    public ResponseEntity<?> atualizarCombustivel(@PathVariable Integer id,
                                                   @RequestBody TipoCombustivelRequest req) {
        return tipoCombustivelRepo.findById(id).map(t -> {
            t.setNome(req.nome());
            tipoCombustivelRepo.save(t);
            return ResponseEntity.ok(new TipoCombustivelResponse(t.getId(), t.getNome(), t.getAtivo()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/tipos-combustivel/{id}")
    public ResponseEntity<Void> desativarCombustivel(@PathVariable Integer id) {
        return tipoCombustivelRepo.findById(id).map(t -> {
            t.setAtivo(false);
            tipoCombustivelRepo.save(t);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
