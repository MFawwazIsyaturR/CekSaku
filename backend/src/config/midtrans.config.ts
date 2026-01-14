import midtransClient from "midtrans-client";
import { Env } from "./env.config";

export let midtransClientInstance: any;

export const initializeMidtrans = () => {
 midtransClientInstance = new midtransClient.Snap({
    isProduction: Env.MIDTRANS_IS_PRODUCTION === "false",
    serverKey: Env.MIDTRANS_SERVER_KEY,
    clientKey: Env.MIDTRANS_CLIENT_KEY,
  });

  // Set webhook to handle payment notifications (optional)
  // midtransClientInstance.setWebhook({
  //   payment_notification: "https://yourdomain.com/midtrans/notification",
  //   finished: "https://yourdomain.com/midtrans/finished",
  //   error: "https://yourdomain.com/midtrans/error"
  // });
};