import { UserModel } from '../models/UserModel'
import { DbClient } from '../utility/db-client'

export class UserRepository {
  async createUser(user: UserModel) {
    const client = DbClient()
    await client.connect()

    const { email, password, salt, phone, userType } = user

    const query =
      'INSERT INTO "user"(email,password,salt,phone,user_type) VALUES($1,$2,$3,$4,$5) RETURNING *;'
    const values = [email, password, salt, phone, userType]
    const result = await client.query(query, values)

    await client.end()
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel
    }
  }

  async findUser(email: string) {
    const client = DbClient()
    await client.connect()

    const query = 'SELECT id, email, phone, user_type, password FROM "user" WHERE email = $1'
    const values = [email]
    const result = await client.query(query, values)

    await client.end()
    if (result.rowCount < 1) {
      throw new Error('wrong data')
    }
    return result.rows[0] as UserModel
  }
}
