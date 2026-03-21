Object.assign(app, {
    async renderTiposCombustivel(c) {
        try {
            const data = await this.get('/api/dominio/tipos-combustivel/todos');

            c.innerHTML = `
          <div class="fade-in">
            <div class="page-header">
              <div><h2><i class="fi fi-rr-gas-pump"></i> Tipos de Combustível</h2><p>${data.length} registro(s)</p></div>
              <button class="btn-primary" onclick="app.modalNovoTipoCombustivel()">+ Novo Tipo</button>
            </div>
            <div class="card"><div class="table-wrap">
              <table>
                <thead><tr><th>Nome</th><th>Status</th><th>Ações</th></tr></thead>
                <tbody>${data.map(t => `<tr>
                  <td>${t.nome}</td>
                  <td>${t.ativo ? '<span class="badge badge-success">Ativo</span>' : '<span class="badge badge-danger">Inativo</span>'}</td>
                  <td>
                    <button class="btn-icon" onclick='app.modalEditarTipoCombustivel(${JSON.stringify(t)})'><i class="fi fi-rr-pencil"></i></button>
                    ${t.ativo ? `<button class="btn-icon" onclick="app.excluirTipoCombustivel(${t.id})"><i class="fi fi-rr-trash"></i></button>` : ''}
                  </td>
                </tr>`).join('')}</tbody>
              </table>
            </div></div>
          </div>`;
        } catch (e) {
            console.error(e);
            c.innerHTML = `<div class="card"><div style="padding:1rem;color:#b91c1c">Erro ao carregar tipos de combustível.</div></div>`;
        }
    },

    modalNovoTipoCombustivel() {
        this.openModal('+ Novo Tipo de Combustível', `
      <form onsubmit="app.submitTipoCombustivel(event,null)">
        <div class="form-group"><label>Nome *</label><input id="tc-nome" required maxlength="50" placeholder="Ex: Gasolina Aditivada"/></div>
        <div class="btn-row">
          <button type="button" class="btn-secondary" onclick="app.closeModal()">Cancelar</button>
          <button type="submit" class="btn-primary">Salvar</button>
        </div>
      </form>`);
    },

    modalEditarTipoCombustivel(t) {
        this.openModal('<i class="fi fi-rr-pencil"></i> Editar Tipo de Combustível', `
      <form onsubmit="app.submitTipoCombustivel(event,${t.id})">
        <div class="form-group"><label>Nome *</label><input id="tc-nome" required maxlength="50" value="${t.nome.replace(/"/g, '&quot;')}"/></div>
        <div class="btn-row">
          <button type="button" class="btn-secondary" onclick="app.closeModal()">Cancelar</button>
          <button type="submit" class="btn-primary">Salvar Alterações</button>
        </div>
      </form>`);
    },

    async submitTipoCombustivel(e, id) {
        e.preventDefault();
        const body = { nome: document.getElementById('tc-nome').value };

        const res = await fetch(id ? `/api/dominio/tipos-combustivel/${id}` : '/api/dominio/tipos-combustivel', {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            this.toast(await res.text(), 'error');
            return;
        }

        this.toast(id ? 'Tipo atualizado!' : 'Tipo criado!');
        this.closeModal();
        this.navigate('tiposCombustivel');
    },

    async excluirTipoCombustivel(id) {
        if (!confirm('Desativar tipo de combustível?')) return;
        await fetch(`/api/dominio/tipos-combustivel/${id}`, { method: 'DELETE' });
        this.toast('Tipo desativado.');
        this.navigate('tiposCombustivel');
    }
});