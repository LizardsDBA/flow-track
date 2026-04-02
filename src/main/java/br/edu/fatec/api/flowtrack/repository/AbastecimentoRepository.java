package br.edu.fatec.api.flowtrack.repository;

import br.edu.fatec.api.flowtrack.entity.Abastecimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface AbastecimentoRepository extends JpaRepository<Abastecimento, Integer> {

    List<Abastecimento> findAllByOrderByDataAbastecimentoDesc();

    List<Abastecimento> findByViaturaIdOrderByDataAbastecimentoDesc(Integer viaturaId);

    @Query("SELECT COALESCE(SUM(a.valorTotal), 0) FROM Abastecimento a")
    BigDecimal totalGasto();

    @Query("SELECT COALESCE(SUM(a.litros), 0) FROM Abastecimento a")
    BigDecimal totalLitros();

    @Query("SELECT COUNT(a) FROM Abastecimento a")
    long totalRegistros();

    @Query("SELECT COALESCE(MAX(a.kmAbastecimento), 0) FROM Abastecimento a WHERE a.viatura.id = :viaturaId")
    Integer findMaxKmByViaturaId(Integer viaturaId);
}
