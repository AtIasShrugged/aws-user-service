import { Length } from 'class-validator'

export class VerificationCodeInput {
  @Length(6)
  code: string
}
