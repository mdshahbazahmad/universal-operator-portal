import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        // modules की फाइलों को भी Vite बिल्ड में शामिल करें
        customers: resolve(__dirname, 'modules/customers.html'),
        billing: resolve(__dirname, 'modules/billing.html'),
        server_monitor: resolve(__dirname, 'modules/server_monitor.html'),
        complaint: resolve(__dirname, 'modules/complaint.html'),
        whatsapp: resolve(__dirname, 'modules/whatsapp.html'),
        plans: resolve(__dirname, 'modules/plans.html'),
        settings: resolve(__dirname, 'modules/settings.html'),
        help_guide: resolve(__dirname, 'modules/help_guide.html'),
      },
    },
  },
});
