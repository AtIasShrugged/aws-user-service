import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { UserService } from '../services/UserService'
import { ErrorResponse } from '../utility/response'
import middy from '@middy/core'
import jsonBodyParser from '@middy/http-json-body-parser'
import { container } from 'tsyringe'

const service = container.resolve(UserService)

export const signUp = middy((event: APIGatewayProxyEventV2) => {
  return service.signUp(event)
}).use(jsonBodyParser())

export const signIn = middy((event: APIGatewayProxyEventV2) => {
  return service.signIn(event)
}).use(jsonBodyParser())

export const verify = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase()
  switch (httpMethod) {
    case 'get':
      return service.getVerificationToken(event)
    case 'post':
      return service.verifyUser(event)
    default:
      return service.responseWithError(event)
  }
}).use(jsonBodyParser())

export const profile = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase()
  switch (httpMethod) {
    case 'get':
      return service.getProfile(event)
    case 'post':
      return service.createProfile(event)
    case 'put':
      return service.updateProfile(event)
    default:
      return service.responseWithError(event)
  }
}).use(jsonBodyParser())

export const cart = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase()
  switch (httpMethod) {
    case 'get':
      return service.getCart(event)
    case 'post':
      return service.createCart(event)
    case 'put':
      return service.updateCart(event)
    default:
      return ErrorResponse(404, 'requested method is not supported!')
  }
}

export const payment = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase()
  switch (httpMethod) {
    case 'get':
      return service.getPaymentMethod(event)
    case 'post':
      return service.addPaymentMethod(event)
    case 'put':
      return service.updatePaymentMethod(event)
    default:
      return ErrorResponse(404, 'requested method is not supported!')
  }
}
