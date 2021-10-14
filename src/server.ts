import path from 'path'

import Koa from 'koa'
import koaBody from 'koa-body'
import Router from 'koa-router'
import serve from 'koa-static'
import send from 'koa-send'

import { uploadFile } from './images/upload'

// const readFile = promisify(fs.readFile)

const app = new Koa()

app.use(koaBody({ multipart: true }))
app.use(serve(path.join(__dirname, 'public')))

const router = new Router()

router.post('/images/upload', uploadFile)

app.use(router.routes())
app.use(router.allowedMethods())

app.use((ctx) => {
  send(ctx, './public/index.html')
})

export default app
