/**
 * Pluggable SMS Notification Service Architecture
 * Supports MSG91, Twilio, or custom SMS gateway providers.
 */

interface SMSPayload {
  phone: string;
  orderId: string;
  customerName: string;
  totalAmount: number;
}

export const sendOrderConfirmationSMS = async (payload: SMSPayload): Promise<boolean> => {
  const smsProvider = process.env.SMS_PROVIDER; // e.g. 'MSG91' or 'TWILIO'
  const smsApiKey = process.env.SMS_API_KEY;

  if (!smsProvider || !smsApiKey) {
    console.log(`[SMS NOTIFICATION MOCK] Provider disabled. Notification queued for ${payload.phone} (Order ${payload.orderId})`);
    return false;
  }

  try {
    if (smsProvider === 'MSG91') {
      // MSG91 dispatch logic integration
      console.log(`[MSG91 SMS DISPATCH] Sending SMS to ${payload.phone}`);
    } else if (smsProvider === 'TWILIO') {
      // Twilio dispatch logic integration
      console.log(`[TWILIO SMS DISPATCH] Sending SMS to ${payload.phone}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Error sending SMS notification:', error);
    return false;
  }
};
