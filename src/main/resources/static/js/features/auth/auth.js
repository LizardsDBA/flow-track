Object.assign(app, {
    async login(e) {
        if (e) e.preventDefault();
        const matricula = document.getElementById('l-matricula').value.trim();
        const senha = document.getElementById('l-senha').value.trim();
        const err = document.getElementById('login-error');

        err.style.display = 'none';

        if (!matricula || !senha) {
            err.textContent = 'Preencha matrícula e senha.';
            err.style.display = 'block';
            return;
        }

        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matricula, senha })
            });

            if (!res.ok) {
                err.textContent = await res.text() || 'Credenciais inválidas.';
                err.style.display = 'block';
                return;
            }

            this.user = await res.json();
            sessionStorage.setItem('flowtrack_user', JSON.stringify(this.user));

            if (this.user.primeiroAcesso) {
                this.modalTrocarSenha();
            } else {
                this.showApp();
            }
        } catch {
            err.textContent = 'Erro ao conectar com o servidor.';
            err.style.display = 'block';
        }
    },

    modalTrocarSenha() {
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('app-view').classList.add('hidden');

        const overlay = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');

        title.textContent = 'Troca de Senha Obrigatória';
        body.innerHTML = `
          <div style="margin-bottom:12px;color:#64748b;">
            <i class="fi fi-rr-lock"></i>
            Por segurança, você deve criar uma nova senha antes de continuar.
          </div>
          <form onsubmit="app.submitTrocarSenha(event)">
            <div class="form-grid cols-1">
              <div class="form-group">
                <label>Senha Atual *</label>
                <input id="ts-senha-atual" type="password" required placeholder="Digite a senha atual"/>
              </div>
              <div class="form-group">
                <label>Nova Senha *</label>
                <input id="ts-nova-senha" type="password" required placeholder="Mínimo 6 caracteres"/>
              </div>
              <div class="form-group">
                <label>Confirmar Nova Senha *</label>
                <input id="ts-confirmar-senha" type="password" required placeholder="Repita a nova senha"/>
              </div>
            </div>
            <p id="ts-error" class="error-msg" style="display:none;"></p>
            <div class="btn-row">
              <button type="submit" class="btn-primary full-width">Alterar Senha e Entrar</button>
            </div>
          </form>`;

        const closeBtn = overlay.querySelector('.modal-close');
        if (closeBtn) closeBtn.style.display = 'none';
        overlay.onclick = null;

        overlay.classList.remove('hidden');
    },

    async submitTrocarSenha(e) {
        e.preventDefault();
        const senhaAtual = document.getElementById('ts-senha-atual').value;
        const novaSenha = document.getElementById('ts-nova-senha').value;
        const confirmarSenha = document.getElementById('ts-confirmar-senha').value;
        const err = document.getElementById('ts-error');

        err.style.display = 'none';

        if (novaSenha.length < 6) {
            err.textContent = 'A nova senha deve ter pelo menos 6 caracteres.';
            err.style.display = 'block';
            return;
        }

        if (novaSenha !== confirmarSenha) {
            err.textContent = 'As senhas não coincidem.';
            err.style.display = 'block';
            return;
        }

        try {
            const res = await fetch(`${API}/api/auth/trocar-senha`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: this.user.id, senhaAtual, novaSenha })
            });

            if (!res.ok) {
                err.textContent = await res.text() || 'Erro ao alterar senha.';
                err.style.display = 'block';
                return;
            }

            this.user.primeiroAcesso = false;
            sessionStorage.setItem('flowtrack_user', JSON.stringify(this.user));

            const overlay = document.getElementById('modal-overlay');
            const closeBtn = overlay.querySelector('.modal-close');
            if (closeBtn) closeBtn.style.display = '';
            overlay.onclick = () => this.closeModal();
            this.closeModal();

            this.toast('Senha alterada com sucesso! Bem-vindo(a).');
            this.showApp();
        } catch {
            err.textContent = 'Erro ao conectar com o servidor.';
            err.style.display = 'block';
        }
    },

    logout() {
        sessionStorage.removeItem('flowtrack_user');
        this.user = null;
        document.getElementById('app-view').classList.add('hidden');
        document.getElementById('login-view').classList.remove('hidden');
        document.getElementById('l-senha').value = '';
    }
});