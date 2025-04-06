/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { closeDb, connectDb } from './config/mongodb'
import { env } from './config/environment'
import router from './routes/v1/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import cors from 'cors'
import { corsOptions } from './config/cors.js'

const startServer = () => {
  const app = express()

  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', router)

  app.use(errorHandlingMiddleware)

  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  // Close database connection
  exitHook(() => {
    console.log('Closing database connection...')
    closeDb()
  })
}

(async () => {
  try {
    console.log('Connecting to database...', process.env.DATABASE_NAME)
    await connectDb()
  } catch (error) {
    console.error('❌[MongoDB]: Connection failed', error);
    process.exit(1);
  }

  startServer()
})()


