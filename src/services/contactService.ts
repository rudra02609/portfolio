import emailjs from '@emailjs/browser';
import { emailConfig } from '../constants/portfolioData';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SendContactResult {
  success: boolean;
  message: string;
  fallback?: boolean;
}

const isEmailJsConfigured = () =>
  Boolean(emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey);

/**
 * Sends a contact message via EmailJS when configured.
 * If EmailJS credentials are not configured, builds a `mailto:` link as a
 * graceful fallback rather than silently dropping the request.
 */
export async function sendContactMessage(data: ContactFormData): Promise<SendContactResult> {
  if (isEmailJsConfigured()) {
    try {
      emailjs.init(emailConfig.publicKey);
      await emailjs.send(emailConfig.serviceId, emailConfig.templateId, {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
      });
      return { success: true, message: 'Message sent successfully!' };
    } catch {
      return {
        success: false,
        message: 'Unable to send via email service. Please try again or email me directly.',
      };
    }
  }

  const subject = encodeURIComponent(data.subject || `Message from ${data.name}`);
  const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
  const mailto = `mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'rudra02609@gmail.com'}?subject=${subject}&body=${body}`;
  window.location.href = mailto;
  return {
    success: true,
    message: 'Opening your email client to send the message.',
    fallback: true,
  };
}
