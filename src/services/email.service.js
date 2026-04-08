const Sib = require('sib-api-v3-sdk');

const client = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verificar?token=${token}`;

  await new Sib.TransactionalEmailsApi().sendTransacEmail({
    sender: { email: process.env.BREVO_SENDER_EMAIL, name: 'UEC' },
    to: [{ email }],
    subject: 'Verifica tu cuenta - API UEC',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">¡Bienvenido a API UEC!</h2>
        <p style="color: #666;">Para completar tu registro, por favor verifica tu email haciendo clic en el siguiente botón:</p>
        <a href="${verifyUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Verificar mi cuenta</a>
        <p style="color: #999; font-size: 14px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="color: #666; word-break: break-all;">${verifyUrl}</p>
        <p style="color: #999; font-size: 14px;">Este enlace expirará en 24 horas.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">Si no creaste una cuenta en API UEC, ignora este email.</p>
      </div>
    `
  });
};

module.exports = { sendVerificationEmail };