import { Resend } from 'resend';

interface EmailPayload {
  to: string;
  customerName: string;
  orderId: string;
  quantity: number;
  bookPrice: number;
  shippingCharge: number;
  totalAmount: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export const sendOrderConfirmationEmail = async (payload: EmailPayload) => {
  const apiKey = process.env.EMAIL_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'orders@ladupsherpa.com';

  const htmlContent = `
    <div style="font-family: 'Georgia', serif; background-color: #050505; color: #E5E5E5; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #3A0303;">
      <h1 style="color: #ffffff; text-align: center; border-bottom: 1px solid #800A0A; padding-bottom: 15px; letter-spacing: 2px;">
        WHISPER TO YOU
      </h1>
      <p style="text-align: center; color: #990000; font-style: italic; margin-top: -10px;">By Ladup Sherpa</p>
      
      <p style="font-size: 16px; margin-top: 30px;">Dear <strong>${payload.customerName}</strong>,</p>
      <p style="color: #A3A3A3; line-height: 1.6;">
        Your order for <strong>"Whisper to You"</strong> has been successfully confirmed. Thank you for inviting this poetry volume into your hands.
      </p>

      <div style="background-color: #0D0D0D; padding: 20px; border: 1px solid #2A2A2A; margin: 25px 0;">
        <h3 style="color: #ffffff; margin-top: 0; border-bottom: 1px solid #1A1A1A; padding-bottom: 10px;">Order Summary</h3>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Order ID:</strong> <span style="color: #CC1F1F;">${payload.orderId}</span></p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Book Title:</strong> Whisper to You</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Author:</strong> Ladup Sherpa</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Quantity:</strong> ${payload.quantity}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Book Price:</strong> ₹${payload.bookPrice}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Shipping Charge:</strong> ${payload.shippingCharge === 0 ? 'FREE' : `₹${payload.shippingCharge}`}</p>
        <p style="margin: 12px 0 0 0; font-size: 18px; color: #ffffff; border-top: 1px solid #2A2A2A; padding-top: 10px;">
          <strong>Total Amount Paid:</strong> <span style="color: #CC1F1F;">₹${payload.totalAmount}</span>
        </p>
      </div>

      <div style="background-color: #0D0D0D; padding: 20px; border: 1px solid #2A2A2A; margin: 25px 0;">
        <h3 style="color: #ffffff; margin-top: 0;">Delivery Address</h3>
        <p style="color: #A3A3A3; margin: 0; line-height: 1.5;">
          ${payload.address}, ${payload.city}, ${payload.state} - ${payload.pincode}
        </p>
      </div>

      <p style="color: #A3A3A3; font-style: italic; text-align: center; margin-top: 30px;">
        "Your copy of Whisper to You will be shipped soon."
      </p>

      <footer style="margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #1A1A1A; padding-top: 20px;">
        © ${new Date().getFullYear()} Ladup Sherpa. All rights reserved.
      </footer>
    </div>
  `;

  if (!apiKey || apiKey.includes('YOUR_RESEND_API_KEY')) {
    console.log(`[MOCK EMAIL SENT] To: ${payload.to} | Order ID: ${payload.orderId} | Total: ₹${payload.totalAmount}`);
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromEmail,
      to: [payload.to],
      subject: `Order Confirmed — Whisper to You (${payload.orderId})`,
      html: htmlContent,
    });
    console.log(`✅  Order confirmation email sent to ${payload.to}`);
  } catch (error) {
    console.error('❌  Error sending confirmation email:', error);
  }
};
