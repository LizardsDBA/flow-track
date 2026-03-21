Object.assign(app, {
    openModal(title, html) {
        document.getElementById('modal-title').innerHTML = title;
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal-overlay').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
});