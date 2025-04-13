const Brevo = require('@getbrevo/brevo');
import { env } from '~/config/environment.js';

let apiInstance = new Brevo.TransactionalEmailsApi();

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = env.BREVO_API_KEY;

const sendEmail = async (data) => {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME };
    sendSmtpEmail.to = [{ email: data.to }];
    sendSmtpEmail.subject = data.subject;
    sendSmtpEmail.htmlContent = data.htmlContent;

    try {
        return await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const brevoProvider = {
    sendEmail,
};

export default brevoProvider;