import { UserAddressModel } from './UserAddressModel'

export interface UserModel {
  id?: number
  email: string
  password: string
  salt: string
  phoneNumber: string
  userType: 'BUYER' | 'SELLER'
  firstName?: string
  lastName?: string
  profilePic?: string
  verification_code?: number
  expiry?: string
  addresses?: UserAddressModel[]
}
