Object.assign(app, {
    async renderDashboard(c) {
        try {
            const d = await this.get('/api/abastecimentos/dashboard');

            c.innerHTML = `
          <div class="fade-in">
            <div class="page-header">
              <div><h2><i class="fi fi-rr-chart-histogram"></i>  Painel de Indicadores</h2><p>Visão geral da frota</p></div>
            </div>
            <div class="kpi-grid">
              ${this.kpi('<i class="fi fi-rr-car"></i>', d.totalViaturas ?? 0, 'Total Viaturas')}
              ${this.kpi('<i class="fi fi-rr-check"></i>', d.viaturasAtivas ?? 0, 'Viaturas Ativas')}
              ${this.kpi('<i class="fi fi-rr-gas-pump"></i>', d.totalAbastecimentos ?? 0, 'Abastecimentos')}
              ${this.kpi('<i class="fi fi-rr-user"></i>', d.totalTecnicos ?? 0, 'Técnicos Ativos')}
            </div>
          </div>`;
        } catch (e) {
            console.error(e);
            c.innerHTML = `
          <div class="card">
            <div class="card-header"><h3>Erro</h3></div>
            <div style="padding:1rem;color:#b91c1c">
              Não foi possível carregar o dashboard.
            </div>
          </div>`;
        }
    }
});