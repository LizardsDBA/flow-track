Object.assign(app, {
    async renderDashboard(c) {
        try {
            const d = await this.get('/api/abastecimentos/dashboard');

            c.innerHTML = `
          <div class="fade-in">
            <div class="page-header">
              <div><h2><i class="fi fi-rr-chart-histogram"></i> Painel de Indicadores</h2><p>Visão geral da frota</p></div>
              <button class="btn-primary" onclick="app.modalAbrirOS()">+ Abrir OS</button>
            </div>
            <div class="kpi-grid">
              ${this.kpi('<i class="fi fi-rr-car"></i>', d.totalViaturas ?? 0, 'Total Viaturas')}
              ${this.kpi('<i class="fi fi-rr-check"></i>', d.viaturasAtivas ?? 0, 'Viaturas Ativas')}
              ${this.kpi('<i class="fi fi-rr-gas-pump"></i>', d.totalAbastecimentos ?? 0, 'Abastecimentos')}
              ${this.kpi('<i class="fi fi-rr-gas-pump"></i>', 'R$ ' + this.fmt(d.totalGastoCombustivel ?? 0), 'Gasto Combustível')}
              ${this.kpi('<i class="fi fi-rr-user"></i>', d.totalTecnicos ?? 0, 'Técnicos Ativos')}
            </div>
              <div id="dash-os">Carregando...</div>
            </div>
          </div>`;

            try {
                const os = await this.get('/api/os/abertas');
                document.getElementById('dash-os').innerHTML = this.tabelaOS(os, true);
            } catch (e) {
                console.error(e);
                document.getElementById('dash-os').innerHTML =
                    '<div class="empty-state"><div class="empty-icon"><i class="fi fi-rr-clipboard-list"></i></div><p>Erro ao carregar OS abertas.</p></div>';
            }

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