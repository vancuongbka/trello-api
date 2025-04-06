/* eslint-disable no-unused-vars */
import { env } from '../config/environment.js'

export const errorHandlingMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || err.statusCode,
    stack: err.stack
  }

  if (env.BUILD_MODE !== 'dev') {
    delete responseError.stack
  }

  res.status(responseError.statusCode).json(responseError)
}