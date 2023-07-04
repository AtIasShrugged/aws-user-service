import { Twilio } from 'twilio'

const accountSid = process.env.TWILIO_SID || ''
const authToken = process.env.TWILIO_AUTH_TOKEN || ''
const phoneNumber = process.env.TWILIO_PHONE_NUMBER || ''

const client = new Twilio(accountSid, authToken)

export const generateAccessCode = () => {
  const code = Math.floor(10000 + Math.random() * 900000)
  let expiry = new Date()
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000)
  return { code, expiry }
}

export const sendVerificationCode = async (code: number, recipientPhoneNumber: string) => {
  const res = await client.messages.create({
    body: `Your verification code is ${code}`,
    from: phoneNumber,
    to: `+${recipientPhoneNumber}`.trim(),
  })
  console.log(res)
  return res
}
