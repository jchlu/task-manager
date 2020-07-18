const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'task-manager-app@exito.tech',
    subject: 'Welcome to Task Manager',
    text: `Welcome ${name}, let us know how you get on with the app!`,
  })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'task-manager-app@exito.tech',
    subject: 'Sorry to see you go',
    text: `Dear ${name}, your account on Task Manager has been deleted as requested. Please let us know any feedback by replying to this email.`,
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
}
