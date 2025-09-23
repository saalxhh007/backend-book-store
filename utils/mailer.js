import nodeMailer from "nodemailer";

export async function sendVerificationEmail(email, token) {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `<p>Click the link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`
  });
}

export const sendOrderStatus = async (email, order_id, status, reason, address=null,) => {
  try {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"Book-store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Book-store - Order Confirmation",
      html: `<div>
                <h1>
                  <a href="http://127.0.0.1:3000" 
                    style="text-decoration: none; color: #8B6A41;">
                    Book Store
                  </a>
                </h1>
                <h2>Thank You For Purchasing</h2>
                <p>Commande N <strong>${order_id}</strong></p>
                ${status === "Confirmed" ? 
                  `<p>Your Order is confirmed and on its way.</p>
                   <h4>Shipping Address:</h4>
                  ${address.line1 || ""} ${address.line2 || ""}<br/>
                  ${address.municipality || ""}, ${address.district || ""}, ${address.state || ""}` :
                  `<p>Your Order is declined due to:</p>
                   <h4>${reason}</h4>`}
            </div>`
    }

    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.error("❌ Failed to send email:", err)
  }
}

export const sendOrderCreation = async (email, order_id) => {
  try {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"Book-store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Book-store - Order Request",
      html: `<div>
                <h1>
                  <a href="http://127.0.0.1:3000" 
                    style="text-decoration: none; color: #8B6A41;">
                    Book Store
                  </a>
                </h1>
                <h2>Thank You For Purchasing</h2>
                <p>Commande N <strong>${order_id}</strong></p>
                <p>Your Order is waiting for confirmation and on its way.</p>
            </div>`
    }

    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.error("❌ Failed to send email:", err)
  }
}

export default { sendVerificationEmail }