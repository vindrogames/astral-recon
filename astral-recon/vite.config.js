import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    preview: {
        port: 8000,
        strictPort: true,
       },
       server: {
        port: 8000,
        strictPort: true,
        host: true,
        origin: "http://0.0.0.0:8000",
       },
});