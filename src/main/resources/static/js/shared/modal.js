Object.assign(app, {
    openModal(title, html) {
        document.getElementById('modal-title').innerHTML = title;
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal-overlay').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    confirmAction(title, message, onConfirm) {
        this.openModal(title, `
            <div style="text-align: center; padding: 1rem 0;">
                <p style="margin-bottom: 2rem; color: var(--text-muted); font-size: 1rem;">
                    ${message}
                </p>
                <div class="btn-row" style="justify-content: center; gap: 1rem;">
                    <button type="button" class="btn-secondary" onclick="app.closeModal()">
                        Cancelar
                    </button>
                    <button id="confirm-ok-btn" type="button" class="btn-primary" style="padding-left: 2rem; padding-right: 2rem;">
                        Sim, Confirmar
                    </button>
                </div>
            </div>
        `);

        document.getElementById('confirm-ok-btn').onclick = async () => {
            this.closeModal();
            await onConfirm();
        };
    }
});