Object.assign(app, {
    async get(path) {
        const r = await fetch(`${API}${path}`);
        if (!r.ok) {
            const msg = await r.text();
            throw new Error(`Erro ${r.status} em ${path}: ${msg}`);
        }
        return r.json();
    }
});