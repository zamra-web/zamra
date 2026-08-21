import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
        // Admin tab deep links (/admin/reports, /admin/whatsapp, ...) are virtual
        // paths: Vercel rewrites /admin(.*) to the single admin.html bundle, which
        // then picks the tab from location.pathname. The dev server has no such
        // rewrite, so without this every deep link 404s locally and the whole
        // feature looks broken. Extensionless single segments only, so real asset
        // requests under /admin/ still fall through.
        {
            name: 'zamra-admin-deep-links',
            configureServer(server) {
                server.middlewares.use((req, _res, next) => {
                    const path = (req.url || '').split('?')[0];
                    if (/^\/admin\/[^./]+\/?$/.test(path)) req.url = '/admin.html';
                    next();
                });
            },
        },
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                admin: resolve(__dirname, 'admin.html'),
                login: resolve(__dirname, 'login.html'),
                visa: resolve(__dirname, 'visa.html'),
                tours: resolve(__dirname, 'tours.html'),
                hajjUmrah: resolve(__dirname, 'hajj-umrah.html'),
                connect: resolve(__dirname, 'connect.html'),
                soto: resolve(__dirname, 'soto.html'),
                deals: resolve(__dirname, 'deals.html'),
                b2b: resolve(__dirname, 'b2b.html'),
                b2bLogin: resolve(__dirname, 'b2b-login.html'),
            }
        }
    }
});
