Object.assign(app, {
    kpi: (icon, val, label) => `
    <div class="card kpi-card">
      <div style="font-size:1.8rem;margin-bottom:.3rem">${icon}</div>
      <div class="kpi-value">${val}</div>
      <div class="kpi-label">${label}</div>
    </div>`,

    infoBox: (label, val) => `
    <div style="background:var(--bg);border-radius:8px;padding:.6rem .8rem">
      <div style="font-size:.7rem;font-weight:600;color:var(--text-muted);text-transform:uppercase">${label}</div>
      <div style="font-size:.9rem;font-weight:500;margin-top:.15rem">${val}</div>
    </div>`,

    badgeOS(s) {
        const m = { ABERTA: 'badge-success', ENCERRADA: 'badge-gray', CANCELADA: 'badge-danger' };
        const l = {
            ABERTA: '<i class="fi fi-rr-check-circle"></i> Aberta',
            ENCERRADA: '<i class="fi fi-rr-lock"></i> Encerrada',
            CANCELADA: '<i class="fi fi-rr-cross-circle"></i> Cancelada',
        };
        return `<span class="badge ${m[s] || 'badge-gray'}">${l[s] || s}</span>`;
    },

    badgeTipo: t => t === 'UTILITARIO'
        ? '<span class="badge badge-warning"><i class="fi fi-rr-settings"></i> Utilitário</span>'
        : '<span class="badge badge-primary"><i class="fi fi-rr-car"></i> Passeio</span>',

    badgeStatus(s) {
        const m = { DISPONIVEL: 'badge-success', EM_USO: 'badge-warning', INDISPONIVEL: 'badge-danger' };
        const l = {
            DISPONIVEL: '<i class="fi fi-rr-check"></i> Disponível',
            EM_USO: '<i class="fi fi-rr-car"></i> Em Uso',
            INDISPONIVEL: '<i class="fi fi-rr-cross-circle"></i> Indisponível',
        };
        return `<span class="badge ${m[s] || 'badge-gray'}">${l[s] || s}</span>`;
    },

    badgeCombustivel(t) {
        const m = {
            gasolina: ['badge-primary', '<i class="fi fi-rr-gas-pump"></i> Gasolina'],
            etanol: ['badge-success', '<i class="fi fi-rr-leaf"></i> Etanol'],
            diesel: ['badge-warning', '<i class="fi fi-rr-oil-can"></i> Diesel'],
            gnv: ['badge-gray', '<i class="fi fi-rr-wind"></i> GNV'],
        };
        const [cls, lbl] = m[t] || ['badge-gray', t];
        return `<span class="badge ${cls}">${lbl}</span>`;
    },

    tabelaOS(data, showActions = false) {
        if (!data || !data.length)
            return 
        return `<table>
      <thead><tr>
        <th>OS#</th><th>OS/SGI</th><th>Viatura</th><th>Usuário</th><th>Tipo</th>
        <th>Destino</th><th>Requisitante</th>
        <th>KM Saída</th><th>KM Chegada</th><th>Saída</th><th>Status</th><th>Ações</th>
      </tr></thead>
      <tbody>${data.map(os => `
        <tr>
          <td><strong>#${os.id}</strong></td>
          <td>${os.numeroOsExterno || '—'}</td>
          <td>${os.viaturaPrefixo || '—'} <small class="text-muted">${os.viaturaModelo || ''}</small></td>
          <td>${os.usuarioNome || '—'}</td>
          <td><small>${os.tipoServicoNome || os.tipoServico || '—'}</small></td>
          <td><small>${os.destino || '—'}</small></td>
          <td><small>${os.requisitante || '—'}</small></td>
          <td>${os.kmSaida != null ? os.kmSaida.toLocaleString('pt-BR') + ' km' : '—'}</td>
          <td>${os.kmChegada != null ? os.kmChegada.toLocaleString('pt-BR') + ' km' : '—'}</td>
          <td>${this.fmtDate(os.horarioSaida)}</td>
          <td>${this.badgeOS(os.status)}</td>
          <td>
            <button class="btn-icon" title="Detalhes" onclick="app.modalDetalhesOS(${os.id})"><i class="fi fi-rr-search"></i></button>
            ${os.status === 'ABERTA' ? `
              <button class="btn-icon" title="Encerrar OS" onclick="app.modalEncerrarOS(${os.id}, ${os.kmSaida})"><i class="fi fi-rr-flag-checkered"></i></button>
            ` : ''}
          </td>
        </tr>`).join('')}
      </tbody></table>`;
    },

    tabelaAbastecimentos(data) {
        if (!data || !data.length)
            return '<div class="empty-state"><div class="empty-icon"><i class="fi fi-rr-gas-pump"></i></div><p>Nenhum abastecimento encontrado.</p></div>';

        return `<table>
      <thead><tr>
        <th>Viatura</th><th>Usuário</th><th>Matrícula</th><th>Combustível</th>
        <th>Litros</th><th>Custo/L</th><th>Valor</th><th>KM</th><th>NF</th><th>Data</th><th>Obs.</th>
      </tr></thead>
      <tbody>${data.map(a => {
            const custoL = parseFloat(a.litros) > 0
                ? (parseFloat(a.valorTotal) / parseFloat(a.litros)) : 0;
            return `<tr>
        <td>${a.viaturaPrefixo || '—'} <small>${a.viaturaModelo || ''}</small></td>
        <td>${a.usuarioNome || '—'}</td>
        <td><code>${a.usuarioMatricula || '—'}</code></td>
        <td>${this.badgeCombustivel(a.tipoCombustivel)}</td>
        <td>${a.litros} L</td>
        <td><small>R$ ${this.fmt(custoL)}/L</small></td>
        <td><strong>R$ ${this.fmt(a.valorTotal)}</strong></td>
        <td>${a.kmAbastecimento?.toLocaleString('pt-BR')} km</td>
        <td><small>${a.numeroNf || '—'}</small></td>
        <td>${this.fmtDate(a.dataAbastecimento)}</td>
        <td><small>${a.observacao || '—'}</small></td>
      </tr>`;
        }).join('')}</tbody></table>`;
    }
});