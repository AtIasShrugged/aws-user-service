import { autoInjectable } from 'tsyringe'
import { UserModel } from '../models/UserModel'
import { DbConnector } from './DbConnector'
import { UserProfileInput } from '../models/dto'
import { UserAddressModel } from '../models/UserAddressModel'

@autoInjectable()
export class UserRepository {
  constructor(private dbConnector: DbConnector) {}

  async createUser(user: UserModel) {
    const { email, password, salt, phoneNumber, userType } = user

    const query =
      'INSERT INTO "user"(email, password, salt, phone_number, user_type) VALUES($1,$2,$3,$4,$5) RETURNING *'
    const values = [email, password, salt, phoneNumber, userType]

    const result = await this.dbConnector.executeQuery(query, values)
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel
    }
  }

  async findUser(email: string) {
    const query =
      'SELECT id, email, phone_number, user_type, password, verification_code, expiry FROM "user" WHERE email = $1'
    const values = [email]

    const result = await this.dbConnector.executeQuery(query, values)
    if (result.rowCount < 1) {
      throw new Error('wrong data')
    }
    return result.rows[0] as UserModel
  }

  async setVerificationCode(userId: number, code: number, expiry: Date) {
    const query =
      'UPDATE "user" SET verification_code=$1, expiry=$2 WHERE id = $3 AND verified=false RETURNING *'
    const values = [code, expiry, userId]

    const result = await this.dbConnector.executeQuery(query, values)
    if (result.rowCount < 1) {
      throw new Error('wrong data')
    }
    return result.rows[0] as UserModel
  }

  async verifyUser(userId: number) {
    const query =
      'UPDATE "user" SET verified=true, verification_code=null, expiry=null WHERE id = $1 AND verified=false RETURNING *'
    const values = [userId]

    const result = await this.dbConnector.executeQuery(query, values)
    if (result.rowCount < 1) {
      throw new Error('user already verified')
    }
    return result.rows[0] as UserModel
  }

  async fillOutProfile(userId: number, payload: UserProfileInput) {
    const { firstName, lastName, userType, address } = payload

    await this.updateProfile(userId, firstName, lastName, userType)

    const query =
      'INSERT INTO "user_address"(user_id, address_line1, address_line2, city, post_code, country) VALUES($1,$2,$3,$4,$5,$6) RETURNING *'
    const values = [
      userId,
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.postCode,
      address.country,
    ]

    const result = await this.dbConnector.executeQuery(query, values)
    if (result.rowCount < 1) {
      throw new Error('wrong data')
    }

    return result.rows[0] as UserAddressModel
  }

  async updateProfile(userId: number, firstName: string, lastName: string, userType: string) {
    const query =
      'UPDATE "user" SET first_name=$1, last_name=$2, user_type=$3 WHERE id = $4 RETURNING *'
    const values = [firstName, lastName, userType, userId]

    const result = await this.dbConnector.executeQuery(query, values)
    if (result.rowCount < 1) {
      throw new Error('wrong data')
    }
    return result.rows[0] as UserModel
  }

  async getUserProfile(userId: number) {
    const profileQuery =
      'SELECT first_name, last_name, email, phone_number, user_type, verified FROM "user" WHERE id = $1'
    const profileValues = [userId]

    const profileResult = await this.dbConnector.executeQuery(profileQuery, profileValues)

    if (profileResult.rowCount < 1) {
      throw new Error('user profile does not exist')
    }

    const profile = profileResult.rows[0] as UserModel

    const addressQuery =
      'SELECT id, address_line1, address_line2, city, post_code, country FROM "user_address" WHERE user_id = $1'
    const addressValues = [userId]

    const addresses = await this.dbConnector.executeQuery(addressQuery, addressValues)
    if (addresses.rowCount > 0) {
      profile.addresses = addresses.rows as UserAddressModel[]
    }

    return profile
  }
}
