Object.assign(app, {
    openModal(title, html) {
        document.getElementById('modal-title').innerHTML = title;
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal-overlay').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    confirmAction(title, msg, onConfirm) {
        this.openModal(title, `
            <div style="text-align:center;padding:1rem 0">
                <p style="margin-bottom:1.5rem;color:var(--text-muted)">${msg}</p>
                <div class="btn-row" style="justify-content:center">
                    <button class="btn-secondary" onclick="app.closeModal()">Não, Voltar</button>
                    <button id="modal-confirm-btn" class="btn-primary">Sim, Confirmar</button>
                </div>
            </div>
        `);
        document.getElementById('modal-confirm-btn').onclick = async () => {
            app.closeModal();
            await onConfirm();
        };
    }
});