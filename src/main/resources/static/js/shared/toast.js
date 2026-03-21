Object.assign(app, {
    createToast() {
        const t = document.createElement('div');
        t.id = 'toast';
        document.body.appendChild(t);
    },

    toast(msg, type = 'success') {
        const t = document.getElementById('toast');
        t.textContent = msg;
        t.className = `show ${type}`;
        setTimeout(() => t.className = '', 3500);
    }
});