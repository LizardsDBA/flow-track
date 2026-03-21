const app = {
    user: null,

    init() {
        const s = sessionStorage.getItem('flowtrack_user');
        if (s) {
            this.user = JSON.parse(s);
            this.showApp();
        }
        this.createToast();
    },

    showApp() {
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');
        document.getElementById('user-role-label').textContent = this.user.isAdmin ? 'Administrador' : 'Técnico';
        document.getElementById('top-user-info').textContent = this.user.nome;
        document.getElementById('user-info-sidebar').innerHTML =
            `<strong style="color:#f1f5f9">${this.user.nome}</strong><br>${this.user.matricula}`;
        this.renderMenu();
        this.navigate(this.user.isAdmin ? 'dashboard' : 'abastecimentos');
    }
};