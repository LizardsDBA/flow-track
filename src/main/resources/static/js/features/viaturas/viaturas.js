Object.assign(app, {
    async renderViaturas(c) {
        try {
            const data = await this.get('/api/viaturas/todas');

            c.innerHTML = `
          <div class="fade-in">
            <div class="page-header">
              <div><h2><i class="fi fi-rr-car"></i> Gestão de Viaturas</h2><p>Cadastro da frota</p></div>
              <button class="btn-primary" onclick="app.modalNovaViatura()">+ Nova Viatura</button>
            </div>
            <div class="card"><div class="table-wrap">
              <table>
                <thead><tr><th>Prefixo</th><th>Placa</th><th>Veículo</th><th>Ano</th><th>Tipo</th><th>KM Atual</th><th>Status</th><th>Ações</th></tr></thead>
                <tbody>${data.map(v => `<tr>
                  <td><strong>${v.prefixo}</strong></td>
                  <td>${v.placa}</td>
                  <td>${v.marca} ${v.modelo}</td>
                  <td>${v.ano}</td>
                  <td>${this.badgeTipo(v.tipo)}</td>
                  <td>${v.kmAtual.toLocaleString('pt-BR')} km</td>
                  <td>${v.ativo ? this.badgeStatus(v.status) : '<span class="badge badge-gray"><i class="fi fi-rr-ban"></i> Inativa</span>'}</td>
                  <td>
                    <button class="btn-icon" onclick='app.modalEditarViatura(${JSON.stringify(v)})' title="Editar"><i class="fi fi-rr-pencil"></i></button>
                    ${v.ativo ? 
                        `<button class="btn-icon" onclick="app.desativarViatura(${v.id})" title="Desativar"><i class="fi fi-rr-trash"></i></button>` : 
                        `<button class="btn-icon" onclick="app.ativarViatura(${v.id})" title="Ativar"><i class="fi fi-rr-check-circle"></i></button>`}
                  </td>
                </tr>`).join('')}
                </tbody>
              </table>
            </div></div>
          </div>`;
        } catch (e) {
            console.error(e);
            c.innerHTML = `<div class="card"><div style="padding:1rem;color:#b91c1c">Erro ao carregar viaturas.</div></div>`;
        }
    },

    modalNovaViatura() {
        this.openModal('+ Nova Viatura', `
      <form onsubmit="app.submitViatura(event,null)">
        <div class="form-grid">
          <div class="form-group"><label>Prefixo *</label><input id="v-prefixo" required placeholder="SJC-06"/></div>
          <div class="form-group"><label>Placa *</label><input id="v-placa" required placeholder="ABC1D23"/></div>
          <div class="form-group"><label>Marca *</label><input id="v-marca" required placeholder="Volkswagen"/></div>
          <div class="form-group"><label>Modelo *</label><input id="v-modelo" required placeholder="Gol"/></div>
          <div class="form-group"><label>Ano *</label><input id="v-ano" type="number" required min="2000" max="2030"/></div>
          <div class="form-group"><label>KM Atual</label><input id="v-km" type="number" min="0" value="0"/></div>
          <div class="form-group span-2"><label>Tipo *</label>
            <select id="v-tipo" required>
              <option value="utilitario">Utilitário</option>
              <option value="passeio">Passeio</option>
            </select>
          </div>
        </div>
        <div class="btn-row">
          <button type="button" class="btn-secondary" onclick="app.closeModal()">Cancelar</button>
          <button type="submit" class="btn-primary">Salvar</button>
        </div>
      </form>`);
    },

    modalEditarViatura(v) {
        this.openModal('<i class="fi fi-rr-pencil"></i> Editar Viatura', `
      <form onsubmit="app.submitViatura(event,${v.id})">
        <div class="form-grid">
          <div class="form-group"><label>Prefixo *</label><input id="v-prefixo" required value="${v.prefixo}"/></div>
          <div class="form-group"><label>Placa *</label><input id="v-placa" required value="${v.placa}"/></div>
          <div class="form-group"><label>Marca *</label><input id="v-marca" required value="${v.marca}"/></div>
          <div class="form-group"><label>Modelo *</label><input id="v-modelo" required value="${v.modelo}"/></div>
          <div class="form-group"><label>Ano *</label><input id="v-ano" type="number" required value="${v.ano}"/></div>
          <div class="form-group"><label>KM Atual</label><input id="v-km" type="number" min="0" value="${v.kmAtual}"/></div>
          <div class="form-group"><label>Tipo *</label>
            <select id="v-tipo" required>
              <option value="utilitario" ${v.tipo === 'UTILITARIO' ? 'selected' : ''}>Utilitário</option>
              <option value="passeio" ${v.tipo === 'PASSEIO' ? 'selected' : ''}>Passeio</option>
            </select>
          </div>
          <div class="form-group"><label>Status</label>
            <select id="v-status">
              <option value="DISPONIVEL" ${v.status === 'DISPONIVEL' ? 'selected' : ''}>Disponível</option>
              <option value="EM_USO" ${v.status === 'EM_USO' ? 'selected' : ''}>Em Uso</option>
              <option value="INDISPONIVEL" ${v.status === 'INDISPONIVEL' ? 'selected' : ''}>Indisponível</option>
            </select>
          </div>
        </div>
        <div class="btn-row">
          <button type="button" class="btn-secondary" onclick="app.closeModal()">Cancelar</button>
          <button type="submit" class="btn-primary">Salvar Alterações</button>
        </div>
      </form>`);
    },

    async submitViatura(e, id) {
        e.preventDefault();

        const body = {
            prefixo: document.getElementById('v-prefixo').value,
            placa: document.getElementById('v-placa').value,
            marca: document.getElementById('v-marca').value,
            modelo: document.getElementById('v-modelo').value,
            ano: parseInt(document.getElementById('v-ano').value),
            kmAtual: parseInt(document.getElementById('v-km').value || '0'),
            tipo: document.getElementById('v-tipo').value,
            status: document.getElementById('v-status')?.value || 'DISPONIVEL',
        };

        const res = await fetch(id ? `/api/viaturas/${id}` : '/api/viaturas', {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            this.toast(await res.text(), 'error');
            return;
        }

        this.toast(id ? 'Viatura atualizada!' : 'Viatura cadastrada!');
        this.closeModal();
        this.navigate('viaturas');
    },

    ativarViatura(id) {
        this.confirmAction(
            '<i class="fi fi-rr-check-circle"></i> Reativar Viatura',
            'Deseja reativar esta viatura no sistema?',
            async () => {
                const res = await fetch(`/api/viaturas/${id}/ativar`, { method: 'PATCH' });
                if (res.ok) {
                    this.toast('Viatura reativada!');
                    this.navigate('viaturas');
                } else {
                    this.toast('Erro ao reativar viatura.', 'error');
                }
            }
        );
    },

    desativarViatura(id) {
        this.confirmAction(
            '<i class="fi fi-rr-trash"></i> Desativar Viatura',
            'Deseja remover esta viatura da frota ativa?',
            async () => {
                await fetch(`/api/viaturas/${id}`, { method: 'DELETE' });
                this.toast('Viatura desativada.');
                this.navigate('viaturas');
            }
        );
    }
});