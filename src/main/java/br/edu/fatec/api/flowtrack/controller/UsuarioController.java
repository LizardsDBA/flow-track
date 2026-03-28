package br.edu.fatec.api.flowtrack.controller;

import br.edu.fatec.api.flowtrack.dto.Dtos.*;
import br.edu.fatec.api.flowtrack.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService service;

    @GetMapping
    public List<UsuarioResponse> listar() {
        return service.listar();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody UsuarioRequest req) {
        try {
            return ResponseEntity.ok(service.criar(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Integer id, @RequestBody UsuarioRequest req) {
        try {
            return ResponseEntity.ok(service.atualizar(id, req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> desativar(@PathVariable Integer id) {
        try {
            service.desativar(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<?> ativar(@PathVariable Integer id) {
        try {
            service.ativar(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}