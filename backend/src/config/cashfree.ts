import { Cashfree, CFEnvironment } from "cashfree-pg";

export let cashfreeInstance: Cashfree | null = null;

export const initializeCashfree = () => {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey || appId.includes('YOUR_APP_ID')) {
    return false;
  }

  const env = process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION' 
    ? CFEnvironment.PRODUCTION 
    : CFEnvironment.SANDBOX;

  cashfreeInstance = new Cashfree(env, appId, secretKey);
  return true;
};
