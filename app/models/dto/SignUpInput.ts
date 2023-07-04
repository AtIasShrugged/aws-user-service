import { IsEmail, Length } from 'class-validator'

export class SignUpInput {
  @IsEmail()
  email: string

  @Length(6, 32)
  password: string

  @Length(10, 12)
  phone: string
}
