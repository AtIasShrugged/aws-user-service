import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/UserModel'

const secret = process.env.JWT_SECRET || 'secret'

export const getSalt = async () => {
  return await bcrypt.genSalt()
}

export const hashPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt)
}

export const validatePassword = async (inputPassword: string, savedPassword: string) => {
  return bcrypt.compare(inputPassword, savedPassword)
}

export const generateToken = async ({ id, email, phoneNumber, userType }: UserModel) => {
  return jwt.sign(
    {
      id,
      email,
      phoneNumber,
      userType,
    },
    secret,
    {
      expiresIn: '30d',
    },
  )
}

export const verifyToken = async (token: string): Promise<UserModel | null> => {
  try {
    if (token !== '') {
      const payload = jwt.verify(token.split(' ')[1], secret)
      return payload as UserModel
    }
  } catch (err) {
    console.log(err)
    return null
  }
}
