import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react'; // React JSX फाइल्स सपोर्ट के लिए

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
      },
    },
  },
});
