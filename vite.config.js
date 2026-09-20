import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        worker_dashboard: resolve(__dirname, 'worker-dashboard.html'),
        worker_signup: resolve(__dirname, 'worker-signup.html'),
        customers: resolve(__dirname, 'modules/customers.html'),
        billing: resolve(__dirname, 'modules/billing.html'),
        server_monitor: resolve(__dirname, 'modules/server_monitor.html'),
        complaint: resolve(__dirname, 'modules/complaint.html'),
        whatsapp: resolve(__dirname, 'modules/whatsapp.html'),
        plans: resolve(__dirname, 'modules/plans.html'),
        workers: resolve(__dirname, 'modules/workers.html'),
        settings: resolve(__dirname, 'modules/settings.html'),
        help_guide: resolve(__dirname, 'modules/help_guide.html'),
      },
    },
  },
});
