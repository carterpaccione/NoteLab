import { defineConfig } from 'cypress';

module.exports = defineConfig({
    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
    },

    e2e: {
        setupNodeEvents(on, config) {
          // implement node event listeners here
          baseUrl: "http://localhost:3000";
        },
      },
    });
    