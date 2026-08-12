import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createReadStream, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import contactHandler from './api/contact.js'

const generatedArchives = [
  ['template-13-flora-legal.zip', 'templates/template-13/template-13-flora-legal.zip'],
  ['template-14-orbe-advocacia.zip', 'templates/template-14/template-14-orbe-advocacia.zip'],
  ['template-15-alva-real-estate-law.zip', 'templates/template-15/template-15-alva-real-estate-law.zip'],
]

function generatedTemplateDownloads() {
  return {
    name: 'generated-template-downloads',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const archive = generatedArchives.find(([name]) => request.url === `/downloads/${name}`)
        if (!archive) return next()
        response.setHeader('Content-Type', 'application/zip')
        response.setHeader('Content-Disposition', `attachment; filename="${archive[0]}"`)
        createReadStream(resolve(archive[1])).pipe(response)
      })
    },
    generateBundle() {
      generatedArchives.forEach(([fileName, source]) => this.emitFile({ type: 'asset', fileName: `downloads/${fileName}`, source: readFileSync(resolve(source)) }))
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
    plugins: [react(), localContactApi(environment), generatedTemplateDownloads()],
  }
})
