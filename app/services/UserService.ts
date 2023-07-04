import { autoInjectable } from 'tsyringe'
import { plainToClass } from 'class-transformer'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { inputValidation } from '../utility/errors'
import { SignInInput, SignUpInput, VerificationCodeInput } from '../models/dto/'
import {
  generateToken,
  getSalt,
  hashPassword,
  validatePassword,
  verifyToken,
} from '../utility/password'
import { datetimeComparsion } from '../utility/date-helpers'
import { UserRepository } from '../repository/UserRepository'
import { ErrorResponse, SuccessResponse } from '../utility/response'
import { generateAccessCode, sendVerificationCode } from '../utility/notification'

@autoInjectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async responseWithError(event: APIGatewayProxyEventV2) {
    return ErrorResponse(404, 'requested method is not supported')
  }

  async signUp(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(SignUpInput, event.body)
      const error = await inputValidation(input)
      if (error) return ErrorResponse(404, error)

      const salt = await getSalt()
      const hashedPassword = await hashPassword(input.password, salt)
      const data = await this.repository.createUser({
        email: input.email,
        password: hashedPassword,
        phoneNumber: input.phoneNumber,
        userType: 'BUYER',
        salt,
      })

      return SuccessResponse(data)
    } catch (err) {
      console.log(err)
      return ErrorResponse(500, err)
    }
  }

  async signIn(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(SignInInput, event.body)
      const error = await inputValidation(input)
      if (error) return ErrorResponse(404, error)

      const data = await this.repository.findUser(input.email)
      const isValid = await validatePassword(input.password, data.password)
      if (!isValid) throw new Error('wrong data')
      const token = await generateToken(data)

      return SuccessResponse({ token })
    } catch (err) {
      console.log(err)
      return ErrorResponse(500, err)
    }
  }

  async getVerificationToken(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization
    const payload = await verifyToken(token)

    if (!payload) return ErrorResponse(403, 'authorization failed')

    const { code, expiry } = generateAccessCode()
    await this.repository.setVerificationCode(payload.id, code, expiry)

    // const res = await sendVerificationCode(code, payload.phoneNumber)
    return SuccessResponse({
      message: 'verification code is sent to your phone number by sms',
    })
  }

  async verifyUser(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization
    const payload = await verifyToken(token)

    if (!payload) return ErrorResponse(403, 'authorization failed')

    const input = plainToClass(VerificationCodeInput, event.body)
    const error = await inputValidation(input)
    if (error) return ErrorResponse(404, error)

    const { verification_code, expiry } = await this.repository.findUser(payload.email)

    if (verification_code === +input.code) {
      const currentTime = new Date()
      const timeDifferance = datetimeComparsion(expiry, currentTime.toISOString(), 'm')

      if (timeDifferance < 0) return ErrorResponse(403, 'verification code is expired')
      this.repository.verifyUser(payload.id)
      console.log('verified successfully')
    }

    return SuccessResponse({ message: 'user verified' })
  }

  async getProfile(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: 'response from getProfile' })
  }

  async createProfile(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: 'response from createProfile' })
  }

  async updateProfile(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: 'response from editProfile' })
  }

  async getCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: 'response from getCart' })
  }

  async createCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: 'response from createCart' })
  }

  async updateCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: 'response from updateCart' })
  }

  async addPaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: 'response from addPaymentMethod' })
  }

  async getPaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: 'response from getPaymentMethod' })
  }

  async updatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: 'response from updatePaymentMethod' })
  }
}
