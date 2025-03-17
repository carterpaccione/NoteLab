import { defineConfig } from 'cypress';
import dotvenv from 'dotenv';
dotvenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

module.exports = defineConfig({
    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
    },

    e2e: {
        env: {
            BASE_URL,
        },
        baseUrl: BASE_URL,
      },
    });
    