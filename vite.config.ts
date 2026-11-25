import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'

/**
 * Writes Netlify's `_redirects` into the build so the backend URL lives in an
 * environment variable (API_PROXY_TARGET) instead of the repository.
 * API_PROXY_TARGET has no VITE_ prefix, so it never reaches the browser bundle.
 */
function netlifyRedirects(proxyTarget: string | undefined): Plugin {
  return {
    name: 'netlify-redirects',
    apply: 'build',
    generateBundle() {
      const rules: string[] = []
      const target = proxyTarget?.trim().replace(/\/+$/, '')

      if (target) {
        let url: URL
        try {
          url = new URL(target)
        } catch {
          this.error(`API_PROXY_TARGET is not a valid URL: "${target}"`)
        }
        if (url.protocol !== 'https:') this.error('API_PROXY_TARGET must use https.')
        rules.push(`/api/*  ${url.origin}/api/:splat  200`)
      } else if (process.env.NETLIFY) {
        this.error('API_PROXY_TARGET is not set. Add it in Netlify > Site configuration > Environment variables.')
      } else {
        this.warn('API_PROXY_TARGET is not set, so /api/* will not be proxied in this build.')
      }

      // Single-page app fallback. Must stay last: Netlify uses the first rule that matches.
      rules.push('/*  /index.html  200')
      this.emitFile({ type: 'asset', fileName: '_redirects', source: `${rules.join('\n')}\n` })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  return {
    plugins: [react(), tailwindcss(), netlifyRedirects(env.API_PROXY_TARGET)],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  }
})
