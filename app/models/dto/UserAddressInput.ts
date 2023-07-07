import { IsString, Length } from 'class-validator'

export class UserAddressInput {
  @IsString()
  addressLine1: string

  @IsString()
  addressLine2: string

  @IsString()
  city: string

  @Length(4, 6)
  postCode: 'BUYER' | 'SELLER'

  @Length(2, 3)
  country: string
}
