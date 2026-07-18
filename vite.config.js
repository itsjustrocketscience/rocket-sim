import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // THIS IS THE MAGIC LINE:
  assetsInclude: ['**/*.stl'], 
})