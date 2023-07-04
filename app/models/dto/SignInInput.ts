import { IsEmail, Length } from 'class-validator'

export class SignInInput {
  @IsEmail()
  email: string

  @Length(6, 32)
  password: string
}
