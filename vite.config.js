import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createReadStream, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

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

export default defineConfig({
  plugins: [react(), generatedTemplateDownloads()],
})
