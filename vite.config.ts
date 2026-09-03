// import { defineConfig } from 'vite';

// export default defineConfig({
//   server: {
//     port: 3000
//   }
// });
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@secureshield/web': path.resolve(__dirname, './src/secureshield-sdk')
    }
  }
});