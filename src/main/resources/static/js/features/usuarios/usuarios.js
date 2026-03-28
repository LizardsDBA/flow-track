Object.assign(app, {
    async renderUsuarios(c) {
        try {
            const data = await this.get('/api/usuarios');

            c.innerHTML = `
          <div class="fade-in">
            <div class="page-header">
              <div><h2><i class="fi fi-rr-users"></i> Gestão de Usuários</h2><p>Técnicos e administradores</p></div>
              <button class="btn-primary" onclick="app.modalNovoUsuario()">+ Novo Usuário</button>
            </div>
            <div class="card"><div class="table-wrap">
              <table>
                <thead><tr><th>Nome</th><th>Matrícula</th><th>Perfil</th><th>Status</th><th>Ações</th></tr></thead>
                <tbody>${data.map(u => `<tr>
                  <td><strong>${u.nome}</strong></td>
                  <td><code>${u.matricula}</code></td>
                  <td>${u.isAdmin
                    ? '<span class="badge badge-primary"><i class="fi fi-rr-crown"></i> Admin</span>'
                    : '<span class="badge badge-gray"><i class="fi fi-rr-user"></i> Técnico</span>'}</td>
                  <td>${u.ativo
                    ? '<span class="badge badge-success">Ativo</span>'
                    : '<span class="badge badge-danger">Inativo</span>'}</td>
                  <td>
                    <button class="btn-icon" onclick='app.modalEditarUsuario(${JSON.stringify(u)})'><i class="fi fi-rr-pencil"></i></button>
                    ${u.ativo && u.matricula !== 'ADMIN001'
                    ? `<button class="btn-icon" onclick="app.desativarUsuario(${u.id})" title="Desativar"><i class="fi fi-rr-trash"></i></button>` 
                    : (!u.ativo ? `<button class="btn-icon" onclick="app.ativarUsuario(${u.id})" title="Ativar"><i class="fi fi-rr-check-circle"></i></button>` : '')}
                  </td>
                </tr>`).join('')}</tbody>
              </table>
            </div></div>
          </div>`;
        } catch (e) {
            console.error(e);
            c.innerHTML = `<div class="card"><div style="padding:1rem;color:#b91c1c">Erro ao carregar usuários.</div></div>`;
        }
    },

    modalNovoUsuario() {
        this.openModal('+ Novo Usuário', `
      <form onsubmit="app.submitUsuario(event,null)">
        <div class="form-grid cols-1">
          <div class="form-group"><label>Nome *</label><input id="u-nome" required/></div>
          <div class="form-group"><label>Matrícula *</label><input id="u-matricula" required placeholder="TEC003"/></div>
          <div class="form-group"><label>Senha *</label><input id="u-senha" type="password" required/></div>
          <div class="form-group"><label>Perfil *</label>
            <select id="u-admin">
              <option value="false">Técnico</option>
              <option value="true">Administrador</option>
            </select>
          </div>
        </div>
        <div class="btn-row">
          <button type="button" class="btn-secondary" onclick="app.closeModal()">Cancelar</button>
          <button type="submit" class="btn-primary">Cadastrar</button>
        </div>
      </form>`);
    },

    modalEditarUsuario(u) {
        this.openModal('<i class="fi fi-rr-pencil"></i> Editar Usuário', `
      <form onsubmit="app.submitUsuario(event,${u.id})">
        <div class="form-grid cols-1">
          <div class="form-group"><label>Nome *</label><input id="u-nome" required value="${u.nome}"/></div>
          <div class="form-group"><label>Matrícula</label><input value="${u.matricula}" disabled style="opacity:.6"/></div>
          <div class="form-group"><label>Nova Senha (vazio = mantém)</label><input id="u-senha" type="password"/></div>
          <div class="form-group"><label>Perfil</label>
            <select id="u-admin">
              <option value="false" ${!u.isAdmin ? 'selected' : ''}>Técnico</option>
              <option value="true" ${u.isAdmin ? 'selected' : ''}>Administrador</option>
            </select>
          </div>
        </div>
        <div class="btn-row">
          <button type="button" class="btn-secondary" onclick="app.closeModal()">Cancelar</button>
          <button type="submit" class="btn-primary">Salvar</button>
        </div>
      </form>`);
    },

    async submitUsuario(e, id) {
        e.preventDefault();

        const body = {
            nome: document.getElementById('u-nome').value,
            matricula: id ? undefined : document.getElementById('u-matricula')?.value,
            senha: document.getElementById('u-senha').value || undefined,
            isAdmin: document.getElementById('u-admin').value === 'true',
        };

        const res = await fetch(id ? `/api/usuarios/${id}` : '/api/usuarios', {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            this.toast(await res.text(), 'error');
            return;
        }

        this.toast(id ? 'Usuário atualizado!' : 'Usuário cadastrado!');
        this.closeModal();
        this.navigate('usuarios');
    },

    desativarUsuario(id) {
        this.confirmAction(
            '<i class="fi fi-rr-trash"></i> Desativar Usuário',
            'Deseja realmente desativar este usuário? Ele não conseguirá mais acessar o sistema.',
            async () => {
                const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    this.toast('Usuário desativado.');
                    this.navigate('usuarios');
                } else {
                    const errorMsg = await res.text();
                    this.toast(errorMsg || 'Erro ao desativar usuário.', 'error');
                }
            }
        );
    },

    ativarUsuario(id) {
        this.confirmAction(
            '<i class="fi fi-rr-check-circle"></i> Reativar Usuário',
            'Deseja reativar este usuário no sistema?',
            async () => {
                const res = await fetch(`/api/usuarios/${id}/ativar`, { method: 'PATCH' });
                if (res.ok) {
                    this.toast('Usuário reativado!');
                    this.navigate('usuarios');
                } else {
                    const errorMsg = await res.text();
                    this.toast(errorMsg || 'Erro ao reativar usuário.', 'error');
                }
            }
        );
    }
});