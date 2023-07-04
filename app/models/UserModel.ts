export interface UserModel {
  id?: string
  email: string
  password: string
  salt: string
  phoneNumber: string
  userType: 'BUYER' | 'SELLER'
}
