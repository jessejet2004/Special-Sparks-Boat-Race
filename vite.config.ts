import { defineConfig } from 'vite';
export default defineConfig({ base: './', build: { rollupOptions: { input: { game: 'index.html', gallery: 'gallery.html' } } }, test: { include: ['tests/unit/**/*.test.ts'] } } as any);
