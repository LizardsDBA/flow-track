package br.edu.fatec.api.flowtrack.controller;

import br.edu.fatec.api.flowtrack.dto.Dtos.*;
import br.edu.fatec.api.flowtrack.repository.UsuarioRepository;
import br.edu.fatec.api.flowtrack.repository.ViaturaRepository;
import br.edu.fatec.api.flowtrack.service.AbastecimentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/abastecimentos")
@RequiredArgsConstructor
public class AbastecimentoController {

    private final AbastecimentoService service;
    private final ViaturaRepository    viaturaRepo;
    private final UsuarioRepository    usuarioRepo;

    @GetMapping
    public List<AbastecimentoResponse> listar() {
        return service.listar();
    }

    /**
     * Registra um abastecimento.
     * osId     — opcional (null = abastecimento avulso)
     * viaturaId — obrigatório se osId for null
     * usuarioId — obrigatório se osId for null
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registrar(
            @RequestParam(required = false) Integer osId,
            @RequestParam Integer viaturaId,
            @RequestParam Integer usuarioId,
            @RequestParam String tipoCombustivel,
            @RequestParam BigDecimal litros,
            @RequestParam BigDecimal valorTotal,
            @RequestParam Integer kmAbastecimento,
            @RequestParam(required = false) String numeroNf,
            @RequestParam(required = false) String observacao,
            @RequestParam(required = false) MultipartFile comprovante
    ) {
        try {
            return ResponseEntity.ok(service.registrar(
                    osId, viaturaId, usuarioId,
                    tipoCombustivel, litros, valorTotal,
                    kmAbastecimento, numeroNf, observacao, comprovante));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/comprovante")
    public ResponseEntity<byte[]> getComprovante(@PathVariable Integer id) {
        try {
            byte[] bytes = service.getComprovante(id);
            if (bytes == null || bytes.length == 0) return ResponseEntity.notFound().build();
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(service.getComprovanteTipo(id)))
                    .body(bytes);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        long totalViaturas  = viaturaRepo.count();
        long viaturasAtivas = viaturaRepo.findByAtivoTrue().size();
        long osAbertas      = 0L; // módulo OS será integrado no Sprint 2
        long totalTecnicos  = usuarioRepo.findAll().stream()
                .filter(u -> !u.getIsAdmin() && Boolean.TRUE.equals(u.getAtivo()))
                .count();
        return service.getDashboard(totalViaturas, viaturasAtivas, osAbertas, totalTecnicos);
    }
}
