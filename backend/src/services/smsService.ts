import twilio from 'twilio';

interface SMSPayload {
  phone: string;
  orderId: string;
  customerName: string;
  totalAmount: number;
}

export const sendOrderConfirmationSMS = async (payload: SMSPayload): Promise<boolean> => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'
  const adminNumbers = process.env.ADMIN_WHATSAPP_NUMBERS; // Comma separated, e.g., 'whatsapp:+919876543210,whatsapp:+918888888888'

  if (!accountSid || !authToken || !fromNumber) {
    console.log(`[WHATSAPP MOCK] Notification queued for ${payload.phone} (Order ${payload.orderId})`);
    return false;
  }

  try {
    const client = twilio(accountSid, authToken);
    
    // Format customer phone
    let customerPhone = payload.phone.replace(/\s+/g, '');
    if (!customerPhone.startsWith('+')) {
      customerPhone = '+91' + customerPhone;
    }
    
    // 1. Notify Customer
    const message = `Hello ${payload.customerName}! 📚\n\nYour order for "Whisper to You" (ID: ${payload.orderId}) has been successfully confirmed! Total Paid: ₹${payload.totalAmount}.\n\nThank you for inviting this poetry volume into your hands.\n- Ladup Sherpa`;

    await client.messages.create({
      body: message,
      from: fromNumber,
      to: `whatsapp:${customerPhone}`
    });
    console.log(`✅ WhatsApp sent to customer: ${customerPhone}`);

    // 2. Notify Admins
    if (adminNumbers) {
      const adminMessage = `🚨 NEW ORDER RECEIVED 🚨\n\nOrder ID: ${payload.orderId}\nCustomer: ${payload.customerName}\nPhone: ${payload.phone}\nAmount: ₹${payload.totalAmount}`;
      
      const admins = adminNumbers.split(',').map(n => n.trim());
      for (const admin of admins) {
        if (admin) {
          await client.messages.create({
            body: adminMessage,
            from: fromNumber,
            to: admin
          });
          console.log(`✅ WhatsApp sent to admin: ${admin}`);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error sending WhatsApp notification:', error);
    return false;
  }
};
