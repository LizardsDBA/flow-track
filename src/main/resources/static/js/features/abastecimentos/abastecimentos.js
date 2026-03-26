Object.assign(app, {
    async modalRegistrarAbastecimento(viaturaIdPreset, viaturaLabelPreset) {
        try {
            const [viaturas, combustiveis] = await Promise.all([
                this.get('/api/viaturas/todas'),
                this.get('/api/dominio/tipos-combustivel'),
            ]);

            const ativas = viaturas.filter(v => v.ativo);

            this.openModal('<i class="fi fi-rr-gas-pump"></i> Registrar Abastecimento', `
          <form onsubmit="app.submitAbastecimento(event)" enctype="multipart/form-data">
            <div class="form-grid">
              <div class="form-group span-2">
                <label>Viatura *</label>
                <select id="ab-viatura" required>
                  <option value="">Selecione...</option>
                  ${ativas.map(v =>
                `<option value="${v.id}" ${v.id == viaturaIdPreset ? 'selected' : ''}>${v.prefixo} — ${v.marca} ${v.modelo} (${v.placa})</option>`
            ).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Tipo de Combustível *</label>
                <select id="ab-comb" required>
                  <option value="">Selecione...</option>
                  ${combustiveis.map(c => `<option value="${c.nome}">${c.nome}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>KM no Abastecimento *</label>
                <input id="ab-km" type="number" min="0" required placeholder="KM hodômetro"/>
              </div>
              <div class="form-group">
                <label>Litros *</label>
                <input id="ab-litros" type="number" step="0.001" min="0.001" required placeholder="42.500"/>
              </div>
              <div class="form-group">
                <label>Valor Total (R$) *</label>
                <input id="ab-valor" type="number" step="0.01" min="0.01" required placeholder="280.50"/>
              </div>
              <div class="form-group">
                <label>Número da Nota Fiscal</label>
                <input id="ab-nf" type="text" maxlength="50" placeholder="Ex: 123456"/>
              </div>
              <div class="form-group">
                <label>Comprovante (NF / imagem)</label>
                <input id="ab-comprovante" type="file" accept="image/*,application/pdf"/>
              </div>
              <div class="form-group span-2">
                <label>Observação</label>
                <textarea id="ab-obs" placeholder="Posto, localização..."></textarea>
              </div>
            </div>
            <div class="btn-row">
              <button type="button" class="btn-secondary" onclick="app.closeModal()">Cancelar</button>
              <button type="submit" class="btn-primary btn-success"><i class="fi fi-rr-check"></i> Salvar Abastecimento</button>
            </div>
          </form>`);
        } catch (e) {
            console.error(e);
            this.toast('Erro ao carregar modal de abastecimento.', 'error');
        }
    },

    async submitAbastecimento(e) {
        e.preventDefault();

        const fd = new FormData();
        fd.append('viaturaId', document.getElementById('ab-viatura').value);
        fd.append('usuarioId', this.user.id);
        fd.append('tipoCombustivel', document.getElementById('ab-comb').value);
        fd.append('litros', document.getElementById('ab-litros').value);
        fd.append('valorTotal', document.getElementById('ab-valor').value);
        fd.append('kmAbastecimento', document.getElementById('ab-km').value);
        fd.append('numeroNf', document.getElementById('ab-nf').value);
        fd.append('observacao', document.getElementById('ab-obs').value);
        const comp = document.getElementById('ab-comprovante')?.files?.[0];
        if (comp) fd.append('comprovante', comp);

        try {
            const res = await fetch(`${API}/api/abastecimentos`, { method: 'POST', body: fd });

            if (!res.ok) {
                this.toast(await res.text(), 'error');
                return;
            }

            this.toast('Abastecimento registrado!');
            this.closeModal();
            this.navigate('abastecimentos');
        } catch {
            this.toast('Erro ao registrar abastecimento.', 'error');
        }
    },

    async renderAbastecimentos(c) {
        try {
            const [data, viaturas] = await Promise.all([
                this.get('/api/abastecimentos'),
                this.get('/api/viaturas/todas'),
            ]);

            this._abastecimentos = data;

            c.innerHTML = `
          <div class="fade-in">
            <div class="page-header">
              <div><h2><i class="fi fi-rr-gas-pump"></i> Abastecimentos</h2><p>${data.length} registro(s)</p></div>
              <button class="btn-primary btn-success" onclick="app.modalRegistrarAbastecimento()"><i class="fi fi-rr-gas-pump"></i> Registrar Abastecimento</button>
            </div>
            <div id="ab-summary"></div>
            <div class="card"><div class="table-wrap" id="ab-table">
              ${this.tabelaAbastecimentos(data)}
            </div></div>
          </div>`;

            this.atualizarResumoAbastecimentos(data);
        } catch (e) {
            console.error(e);
            c.innerHTML = `<div class="card"><div style="padding:1rem;color:#b91c1c">Erro ao carregar abastecimentos.</div></div>`;
        }
    },

    filtrarAbastecimentos() {
        const prefixo = document.getElementById('fil-viatura')?.value;
        const de = document.getElementById('fil-de')?.value;
        const ate = document.getElementById('fil-ate')?.value;
        let filtered = this._abastecimentos || [];

        if (prefixo) filtered = filtered.filter(a => a.viaturaPrefixo === prefixo);
        if (de) filtered = filtered.filter(a => new Date(a.dataAbastecimento) >= new Date(de));
        if (ate) filtered = filtered.filter(a => new Date(a.dataAbastecimento) <= new Date(ate + 'T23:59:59'));

        document.getElementById('ab-table').innerHTML = this.tabelaAbastecimentos(filtered);
        this.atualizarResumoAbastecimentos(filtered);
    },

    limparFiltrosAbastecimento() {
        ['fil-viatura', 'fil-de', 'fil-ate'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        document.getElementById('ab-table').innerHTML = this.tabelaAbastecimentos(this._abastecimentos || []);
        this.atualizarResumoAbastecimentos(this._abastecimentos || []);
    },

    atualizarResumoAbastecimentos(data) {
        const el = document.getElementById('ab-summary');

        if (!el) return;

        el.innerHTML = `
        <div class="kpi-grid" style="margin-bottom:1rem">
        </div>`;
    }
});