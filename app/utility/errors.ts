import { ValidationError, validate } from 'class-validator'

export const inputValidation = async (input: any): Promise<ValidationError[] | null> => {
  const error = await validate(input, {
    ValidationError: { target: true },
  })

  if (error.length) {
    return error
  }
  return null
}
