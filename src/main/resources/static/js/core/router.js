Object.assign(app, {
    renderMenu() {
        const m = document.getElementById('sidebar-menu');
        if (this.user.isAdmin) {
            m.innerHTML = `
        <div class="sidebar-section-label">Dashboard</div>
        <button class="menu-btn" data-screen="dashboard" onclick="app.navigate('dashboard')"><span class="icon"><i class="fi fi-rr-chart-histogram"></i></span> Indicadores</button>
        <div class="sidebar-section-label">Cadastros</div>
        <button class="menu-btn" data-screen="viaturas" onclick="app.navigate('viaturas')"><span class="icon"><i class="fi fi-rr-car"></i></span> Viaturas</button>
        <button class="menu-btn" data-screen="usuarios" onclick="app.navigate('usuarios')"><span class="icon"><i class="fi fi-rr-users"></i></span> Usuários</button>
        <div class="sidebar-section-label">Domínio</div>
        <button class="menu-btn" data-screen="tiposCombustivel" onclick="app.navigate('tiposCombustivel')"><span class="icon"><i class="fi fi-rr-gas-pump"></i></span> Tipos de Combustível</button>
        <div class="sidebar-section-label">Relatórios</div>
        <button class="menu-btn" data-screen="abastecimentos" onclick="app.navigate('abastecimentos')"><span class="icon"><i class="fi fi-rr-gas-pump"></i></span> Abastecimentos</button>`;

        } else {
            m.innerHTML = `
        <div class="sidebar-section-label">Combustível</div>
        <button class="menu-btn" data-screen="abastecimentos" onclick="app.navigate('abastecimentos')"><span class="icon"><i class="fi fi-rr-gas-pump"></i></span> Abastecimentos</button>`;
        }
    },

    navigate(screen) {
        if (window.innerWidth < 1025) this.closeSidebar();
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`.menu-btn[data-screen="${screen}"]`);
        if (btn) btn.classList.add('active');

        const c = document.getElementById('view-content');
        c.innerHTML = '<div class="loading"><i class="fi fi-rr-loading"></i> Carregando...</div>';

        const map = {
            dashboard:        () => this.renderDashboard(c),
            viaturas:         () => this.renderViaturas(c),
            usuarios:         () => this.renderUsuarios(c),
            abastecimentos:   () => this.renderAbastecimentos(c),
            tiposCombustivel: () => this.renderTiposCombustivel(c),
        };

        (map[screen] || (() => c.innerHTML = `<h2>${screen}</h2>`))();
    }
});