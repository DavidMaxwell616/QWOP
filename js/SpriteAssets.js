export const SpriteAssets = {
    createCanvas: (w, h, color) => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        return c.toDataURL();
    },

    createCircle: (r, color) => {
        const c = document.createElement('canvas');
        c.width = r * 2;
        c.height = r * 2;
        const ctx = c.getContext('2d');
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(r, r, r, 0, Math.PI * 2);
        ctx.fill();
        return c.toDataURL();
    }
};