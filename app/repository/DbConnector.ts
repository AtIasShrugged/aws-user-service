import { DbClient } from '../utility/db-client'
import { singleton } from 'tsyringe'

@singleton()
export class DbConnector {
  async executeQuery(query: string, values: unknown[]) {
    const client = DbClient()
    await client.connect()
    const result = await client.query(query, values)
    await client.end()
    return result
  }
}
