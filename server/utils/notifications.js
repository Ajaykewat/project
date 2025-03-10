import OneSignal from "@onesignal/node-onesignal";
import dotenv from "dotenv";

dotenv.config();

// const client = new OneSignal.Client(
//   process.env.ONESIGNAL_APP_ID,
//   process.env.ONESIGNAL_API_KEY
// );

export const sendNotification = async (playerId, title, message) => {
  try {
    const notification = {
      include_player_ids: [playerId],
      contents: {
        en: message,
      },
      headings: {
        en: title,
      },
    };

    // await client.createNotification(notification);
  } catch (error) {
    console.error("OneSignal notification error:", error);
  }
};
