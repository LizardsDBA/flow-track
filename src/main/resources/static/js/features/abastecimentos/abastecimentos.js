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
                <input id="ab-km"
                   type="text"
                   inputmode="numeric"
                   required
                   placeholder="KM hodômetro"
                   oninput="this.value = this.value.replace(/\\D/g, '')" 
                />
              </div>
              <div class="form-group">
                <label>Litros *</label>
                <input id="ab-litros"
                    type="text"
                    inputmode="numeric"
                    placeholder="42,500"
                    oninput="app.maskDecimal(this, 3)" 
                />
              </div>
              <div class="form-group">
                <label>Valor Total (R$) *</label>
                <input id="ab-valor"
                    type="text"
                    inputmode="numeric"
                    placeholder="28,50"
                    oninput="app.maskDecimal(this, 2)" 
                />
              </div>
              <div class="form-group">
                <label>Número da Nota Fiscal *</label>
                <input id="ab-nf" type="text" maxlength="50" required placeholder="Ex: 123456"/>
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

        function parseDecimalBR(valor) {
            if (!valor) return 0;

            return parseFloat(
                valor
                    .replace(/\./g, '') // remove milhar
                    .replace(',', '.')  // troca decimal
            );
        }

        const litros = parseDecimalBR(document.getElementById('ab-litros').value);
        const valorTotal = parseDecimalBR(document.getElementById('ab-valor').value);

        const fd = new FormData();
        fd.append('viaturaId', document.getElementById('ab-viatura').value);
        fd.append('usuarioId', this.user.id);
        fd.append('tipoCombustivel', document.getElementById('ab-comb').value);
        fd.append('litros', litros);
        fd.append('valorTotal', valorTotal);
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
            let [data, viaturas] = await Promise.all([
                this.get('/api/abastecimentos'),
                this.get('/api/viaturas/todas'),
            ]);

            if (!this.user.isAdmin) {
                data = data.filter(a => a.usuarioMatricula === this.user.matricula);
            }

            this._abastecimentos = data;

            c.innerHTML = `
          <div class="fade-in">
            <div class="page-header">
              <div>
                <h2><i class="fi fi-rr-gas-pump"></i> Abastecimentos</h2>
                ${!this.user.isAdmin ? `<p id="ab-count">${data.length} registro(s)</p>` : ''}
              </div>
              <button class="btn-primary btn-success" onclick="app.modalRegistrarAbastecimento()"><i class="fi fi-rr-gas-pump"></i> Registrar Abastecimento</button>
            </div>
            
            ${this.user.isAdmin ? '<div id="ab-summary"></div>' : ''}

            <div class="card" style="padding:1rem;margin-bottom:1rem">
              <div class="form-grid" style="align-items:flex-end">
                <div class="form-group">
                  <label>De</label>
                  <input type="date" id="fil-de"/>
                </div>
                <div class="form-group">
                  <label>Até</label>
                  <input type="date" id="fil-ate"/>
                </div>
                <div class="form-group">
                  <label>Viatura</label>
                  <select id="fil-viatura">
                    <option value="">Todas</option>
                    ${viaturas.map(v => `<option value="${v.prefixo}">${v.prefixo} — ${v.marca} ${v.modelo}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group" style="display:flex;gap:.5rem;justify-content: right; flex-direction: row">
                  <button class="btn-primary" onclick="app.filtrarAbastecimentos()"><i class="fi fi-rr-search"></i> Filtrar</button>
                  <button class="btn-secondary" onclick="app.limparFiltrosAbastecimento()">Limpar</button>
                </div>
              </div>
            </div>

            <div class="card"><div class="table-wrap" id="ab-table">
              ${this.tabelaAbastecimentos(data)}
            </div></div>
          </div>`;

            if (this.user.isAdmin) {
                this.atualizarResumoAbastecimentos(data);
            }
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

        // Verifica quem está logado para atualizar a UI correta
        if (this.user.isAdmin) {
            this.atualizarResumoAbastecimentos(filtered);
        } else {
            const countEl = document.getElementById('ab-count');
            if (countEl) countEl.innerText = `${filtered.length} registro(s)`;
        }
    },

    limparFiltrosAbastecimento() {
        ['fil-viatura','fil-de','fil-ate'].forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });

        document.getElementById('ab-table').innerHTML = this.tabelaAbastecimentos(this._abastecimentos || []);

        if (this.user.isAdmin) {
            this.atualizarResumoAbastecimentos(this._abastecimentos || []);
        } else {
            const countEl = document.getElementById('ab-count');
            if (countEl) countEl.innerText = `${(this._abastecimentos || []).length} registro(s)`;
        }
    },

    atualizarResumoAbastecimentos(data) {
        // CÁLCULOS
        const totalValor  = data.reduce((s, a) => s + parseFloat(a.valorTotal  || 0), 0);
        const totalLitros = data.reduce((s, a) => s + parseFloat(a.litros      || 0), 0);
        // Trata a divisão por zero se não tiver litros
        const custoMedio  = totalLitros > 0 ? totalValor / totalLitros : 0;

        const el = document.getElementById('ab-summary');
        if (!el) return;

        // RENDERIZAÇÃO DOS CARDS
        el.innerHTML = `
        <div class="kpi-grid">
          ${this.kpi('<i class="fi fi-rr-receipt"></i>', data.length, 'Registros')}
          ${this.kpi('<i class="fi fi-rr-coins"></i>', 'R$ '+this.fmt(totalValor), 'Total Gasto')}
          ${this.kpi('<i class="fi fi-rr-gas-pump"></i>', this.fmt(totalLitros)+' L', 'Total Litros')}
          ${this.kpi('<i class="fi fi-rr-calculator"></i>', 'R$ '+this.fmt(custoMedio)+'/L','Custo Médio/L')}
        </div>`;
    },

    maskDecimal(input, casas) {
        // remove tudo que não é número
        let v = input.value.replace(/\D/g, '');

        if (!v) {
            input.value = '';
            return;
        }

        // adiciona zeros à esquerda se necessário
        while (v.length <= casas) {
            v = '0' + v;
        }

        // separa inteiro e decimal
        let inteiro = v.slice(0, -casas);
        let decimal = v.slice(-casas);

        // adiciona separador de milhar
        inteiro = inteiro.replace(/^0+/, '') || '0';
        inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        input.value = `${inteiro},${decimal}`;
    }
});