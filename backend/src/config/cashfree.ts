import { Cashfree } from "cashfree-pg";

export const initializeCashfree = () => {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey || appId.includes('YOUR_APP_ID')) {
    return false;
  }

  Cashfree.XClientId = appId;
  Cashfree.XClientSecret = secretKey;
  Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION' 
    ? Cashfree.Environment.PRODUCTION 
    : Cashfree.Environment.SANDBOX;

  return true;
};
