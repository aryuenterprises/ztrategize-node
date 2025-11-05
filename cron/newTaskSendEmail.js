import cron from "node-cron";
import transporter from "../config/nodemailer.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import NotificationSchema from "../models/notificationModel.js";
import sendEmail from "../config/nodemailer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const autoEmailSendJob = () => {
    
  // ⏱ Run every 1 minute
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    try {
      // find pending notifications that should be sent
      const pendingNotifs = await NotificationSchema.find({
        status: "pending",
        // scheduledAt: { $lte: now },
      });
        console.log(` Found ${pendingNotifs.length} pending notifications.`,pendingNotifs);
      for (let notif of pendingNotifs) {
        try {
          const templatePath = path.join(__dirname, "../views/taskTemplate.ejs");
          console.log(" Template path:", templatePath);
          // render email template with data
          const html = await ejs.renderFile(templatePath,{
            subject: notif.subject,
            message: notif.message,
            name:notif.assignedTo,
          });
          console.log(" Rendered HTML:", html.substring(0, 100)); // log first 100 chars

          // send email
        await sendEmail({
            // from:process.env.EMAIL_USER,
            to: notif.to,
            subject: notif.subject,
            html:html,
          });
          notif.status = "sent";
          notif.sentAt = new Date();
          await notif.save();
          console.log(" Sent notification to:", notif.to);
        } catch (err) {
          notif.status = "failed";
          await notif.save();
          console.error(" Failed to send:", notif.to, err.message);
        }
      }
    } catch (err) {
      console.error(" Cron job error:", err.message);
    }
  });
};

export default autoEmailSendJob;
