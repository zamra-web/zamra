import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
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
                b2b: resolve(__dirname, 'b2b.html'),
                b2bLogin: resolve(__dirname, 'b2b-login.html'),
            }
        }
    }
});
