import Razorpay from 'razorpay';

export const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('YOUR_KEY_ID')) {
    return null;
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};
