import Handlebars from "handlebars";
import nodemailer from "nodemailer";
import { ActivationTemplate } from "../email-templates/activation";
import { ResetPasswordTemplate } from "../email-templates/reset-pass";

export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  body: string;
  subject: string;
}) {
  const { SMTP_GMAIL_PASS, SMTP_EMAIL } = process.env;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_GMAIL_PASS,
    },
  });

  try {
    const testResult = await transport.verify();

    console.log("Test result of transport => ", testResult);
  } catch (error) {
    console.error(error);
  }

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });

    console.log(sendResult);
    return sendResult;
  } catch (error) {
    console.error(error);
  }
}

export function compileActivationTemplate(name: string, url: string) {
  const template = Handlebars.compile(ActivationTemplate);
  const htmlBody = template({
    name,
    url,
  });

  return htmlBody;
}

export function compileForgotPasswordTemplate(name: string, url: string) {
  const template = Handlebars.compile(ResetPasswordTemplate);
  const htmlBody = template({
    name,
    url,
  });

  return htmlBody;
}
