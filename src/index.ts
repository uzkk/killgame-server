import * as path from 'path'
import express from 'express'
import serveIndex from 'serve-index'
import { createServer } from 'http'
import { Server } from 'colyseus'
import { monitor } from '@colyseus/monitor'

import Room from './room'

const port = Number(process.env.PORT || 2567)
const app = express()

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
  server: createServer(app)
})

gameServer.register('killgame', Room)

app.use('/', express.static(path.join(__dirname, 'static')))
app.use('/', serveIndex(path.join(__dirname, 'static'), {icons: true}))

// (optional) attach web monitoring panel
app.use('/colyseus', monitor(gameServer))

gameServer.onShutdown(function(){
  console.log(`game server is going down.`)
})

gameServer.listen(port)

console.log(`Listening on http://localhost:${ port }`)