import { IsString } from 'class-validator'
import { UserAddressInput } from './UserAddressInput'

export class UserProfileInput {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsString()
  userType: string

  address: UserAddressInput
}
