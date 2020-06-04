const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'jnb226@yahoo.in',
    subject: 'Thanks for Joining In',
    text: `Hi ${name} welcome to the App.Let me know how you get along with the App.`,
  });
};

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'jnb226@yahoo.in',
    subject: 'Oops we missed you',
    text: `Hi ${name} we will be missing you. Hope to join us soon.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
};
