import { autoInjectable } from 'tsyringe'
import { UserModel } from '../models/UserModel'
import { DbConnector } from './DbConnector'

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

  async setVerificationCode(userId: string, code: number, expiry: Date) {
    const query =
      'UPDATE "user" SET verification_code=$1, expiry=$2 WHERE id = $3 AND verified=false RETURNING *'
    const values = [code, expiry, userId]

    const result = await this.dbConnector.executeQuery(query, values)
    if (result.rowCount < 1) {
      throw new Error('wrong data')
    }
    return result.rows[0] as UserModel
  }

  async verifyUser(userId: string) {
    const query =
      'UPDATE "user" SET verified=true, verification_code=null, expiry=null WHERE id = $1 AND verified=false RETURNING *'
    const values = [userId]

    const result = await this.dbConnector.executeQuery(query, values)
    if (result.rowCount < 1) {
      throw new Error('wrong data')
    }
    return result.rows[0] as UserModel
  }
}
