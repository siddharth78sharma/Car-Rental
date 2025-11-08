// // server/utils/sendEmail.js
// import { Resend } from 'resend';
// import dotenv from 'dotenv';

// dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendEmail = async (to, subject, htmlContent) => {
//   try {
//     const response = await resend.emails.send({
//       from: 'Your App <onboarding@resend.dev>', // you can customize this
//       to,
//       subject,
//       html: htmlContent,
//     });

//     console.log("Email sent successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Email failed to send");
//   }
// };
