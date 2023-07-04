export interface UserModel {
  id?: string
  email: string
  password: string
  salt: string
  phone: string
  userType: 'BUYER' | 'SELLER'
}
