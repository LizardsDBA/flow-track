package br.edu.fatec.api.flowtrack.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Dtos {

    public record LoginRequest(String matricula, String senha) {}
    public record LoginResponse(Integer id, String nome, String matricula, Boolean isAdmin, Boolean primeiroAcesso) {}
    public record TrocarSenhaRequest(Integer id, String senhaAtual, String novaSenha) {}

    public record ViaturaResponse(Integer id, String prefixo, String placa,
                                  String marca, String modelo, Integer ano,
                                  String tipo, String status, Integer kmAtual, Boolean ativo) {}
    public record ViaturaRequest(String prefixo, String placa, String marca, String modelo,
                                 Integer ano, String tipo, String status, Integer kmAtual) {}

    public record UsuarioResponse(Integer id, String nome, String matricula, Boolean isAdmin, Boolean ativo) {}
    public record UsuarioRequest(String nome, String matricula, String senha, Boolean isAdmin) {}

    public record TipoServicoResponse(Integer id, String nome, Boolean ativo) {}
    public record TipoServicoRequest(String nome) {}
    public record TipoDespesaResponse(Integer id, String nome, Boolean ativo) {}
    public record TipoDespesaRequest(String nome) {}
    public record TipoCombustivelResponse(Integer id, String nome, Boolean ativo) {}
    public record TipoCombustivelRequest(String nome) {}
    public record CidadeResponse(Integer id, String nome) {}

    public record OSResponse(
            Integer id,
            String viaturaPrefixo, String viaturaPlaca, String viaturaModelo,
            String usuarioNome,
            Integer tipoServicoId, String tipoServicoNome,
            Integer cidadeId,      String cidadeNome,
            Integer tipoDespesaId, String tipoDespesaNome,
            Integer kmSaida, Integer kmChegada,
            LocalDateTime horarioSaida, LocalDateTime horarioChegada,
            String status, String observacao, String numeroOsExterno,
            String destino, String requisitante,
            LocalDateTime createdAt
    ) {}

    public record AbrirOSRequest(
            Integer viaturaId,
            Integer usuarioId,
            Integer tipoServicoId,
            Integer cidadeId,
            Integer kmSaida,
            String observacao,
            String numeroOsExterno,
            String destino,
            String requisitante
    ) {}

    public record EncerrarOSRequest(
            Integer kmChegada,
            String observacao,
            Integer tipoDespesaId,
            java.math.BigDecimal valorDespesa,
            String observacaoDespesa
    ) {}

    public record AbastecimentoResponse(
            Integer id,
            Integer osId,
            String viaturaPrefixo, String viaturaPlaca, String viaturaModelo,
            String usuarioNome, String usuarioMatricula,
            String tipoCombustivel,
            BigDecimal litros, BigDecimal valorTotal,
            Integer kmAbastecimento, String numeroNf,
            LocalDateTime dataAbastecimento, String observacao,
            boolean temComprovante
    ) {}

    public record ManutencaoResponse(
            Integer id,
            Integer viaturaId, String viaturaPrefixo, String viaturaModelo,
            Integer usuarioId, String usuarioNome,
            String tipo, String descricao,
            LocalDateTime dataInicio, LocalDateTime dataFim,
            java.math.BigDecimal custo, Integer kmRegistro,
            LocalDateTime createdAt
    ) {}

    public record ManutencaoRequest(
            Integer viaturaId, Integer usuarioId,
            String tipo, String descricao,
            String dataInicio, String dataFim,
            java.math.BigDecimal custo, Integer kmRegistro
    ) {}

    public record DashboardResponse(
            long totalViaturas, long viaturasAtivas,
            long osAbertas, long totalAbastecimentos,
            BigDecimal totalGastoCombustivel,
            BigDecimal totalGastoDespesas,
            BigDecimal totalGasto,
            BigDecimal totalLitros, long totalTecnicos
    ) {}
}