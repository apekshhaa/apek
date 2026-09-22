import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

const localCartoonDirectory = path.resolve(__dirname, './dist/cartoons');

const localCartoonVideos = () => ({
  name: 'serve-local-cartoon-videos',
  configureServer(server: { middlewares: { use: (route: string, handler: (request: any, response: any, next: () => void) => void) => void } }) {
    server.middlewares.use('/cartoons', serveCartoonVideo);
  },
  configurePreviewServer(server: { middlewares: { use: (route: string, handler: (request: any, response: any, next: () => void) => void) => void } }) {
    server.middlewares.use('/cartoons', serveCartoonVideo);
  },
});

const serveCartoonVideo = (request: any, response: any, next: () => void) => {
  const fileName = path.basename((request.url ?? '').split('?')[0]);
  const filePath = path.join(localCartoonDirectory, fileName);

  if (!fileName || fileName !== path.basename(filePath) || !fs.existsSync(filePath)) {
    next();
    return;
  }

  response.setHeader('Content-Type', 'video/mp4');
  fs.createReadStream(filePath).pipe(response);
};

export default defineConfig(() => {
  return {
    plugins: [localCartoonVideos(), react(), tailwindcss()],
    build: {
      emptyOutDir: false,
    },
    resolve: {
      alias: {
        '@bklitui/ui/charts': path.resolve(__dirname, './src/components/charts'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
