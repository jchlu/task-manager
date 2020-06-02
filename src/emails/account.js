require('dotenv').config()

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sgMail.send({
  to: 'sendgrid@exito.tech',
  from: 'sendgrid@exito.tech',
  subject: 'SendGrid test email from NodeJS',
  text: 'I hope this test email is delivered.'
})
