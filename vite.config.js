import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import contactHandler from './api/contact.js'
import { templates } from './src/data/templates.js'

function validateTemplateDownloads() {
  return {
    name: 'validate-template-downloads',
    configResolved(config) {
      const missing = templates.filter(template => !template.archive || !existsSync(resolve(config.publicDir, template.archive)))
      if (missing.length) {
        const labels = missing.map(template => `Template ${template.id}: ${template.archive || 'arquivo não informado'}`).join('\n')
        throw new Error(`ZIPs de templates ausentes em public/:\n${labels}`)
      }
    },
  }
}

function localContactApi(environment) {
  return {
    name: 'local-contact-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.url?.split('?')[0] !== '/api/contact') return next()

        try {
          let body = {}
          if (request.method === 'POST') {
            let rawBody = ''
            for await (const chunk of request) {
              rawBody += chunk
              if (rawBody.length > 64_000) {
                response.statusCode = 413
                response.setHeader('Content-Type', 'application/json; charset=utf-8')
                response.end(JSON.stringify({ success: false, message: 'O formulário excedeu o tamanho permitido.' }))
                return
              }
            }
            body = rawBody ? JSON.parse(rawBody) : {}
          }

          for (const key of ['RESEND_API_KEY', 'RESEND_TO_EMAIL', 'RESEND_FROM_EMAIL']) {
            if (environment[key]) process.env[key] = environment[key]
          }

          const localResponse = {
            status(code) {
              response.statusCode = code
              return this
            },
            json(payload) {
              response.setHeader('Content-Type', 'application/json; charset=utf-8')
              response.end(JSON.stringify(payload))
              return payload
            },
          }

          await contactHandler({ method: request.method, body }, localResponse)
        } catch (error) {
          console.error('Local contact API error:', error)
          if (!response.headersSent) {
            response.statusCode = 500
            response.setHeader('Content-Type', 'application/json; charset=utf-8')
          }
          if (!response.writableEnded) response.end(JSON.stringify({ success: false, message: 'Não foi possível processar o formulário.' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), localContactApi(environment), validateTemplateDownloads()],
  }
})
