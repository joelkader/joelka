// WhatsApp notifications via Twilio
// Enable by setting TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM in .env

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_WHATSAPP_FROM;

const isConfigured = Boolean(TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM);

async function sendWhatsApp(to: string, body: string) {
  if (!isConfigured) {
    console.log(`[WhatsApp stub] To: ${to} | ${body}`);
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      From: TWILIO_FROM!,
      To: `whatsapp:${to}`,
      Body: body,
    }),
  });

  if (!resp.ok) {
    console.error(`WhatsApp send failed: ${resp.status}`, await resp.text());
  }
}

// ─── Notification templates ───

export async function notifyBookingConfirmed(phone: string, unitNumber: string, startDate: string) {
  await sendWhatsApp(
    phone,
    `✅ *Bodeguitas — Booking Confirmed*\n\nUnit: ${unitNumber}\nStart date: ${startDate}\n\nYou'll receive a payment link shortly. Questions? Reply to this message.`
  );
}

export async function notifyPaymentReceived(phone: string, unitNumber: string, amount: number) {
  await sendWhatsApp(
    phone,
    `💰 *Bodeguitas — Payment Received*\n\nUnit: ${unitNumber}\nAmount: $${amount.toFixed(2)}\n\nThank you! Your access code will be sent before your move-in date.`
  );
}

export async function notifyAccessCode(phone: string, unitNumber: string, code: string) {
  await sendWhatsApp(
    phone,
    `🔑 *Bodeguitas — Your Access Code*\n\nUnit: ${unitNumber}\nGate code: ${code}\n\nAccess hours: 6am–10pm daily. Keep this code private.`
  );
}

export async function notifyPaymentFailed(phone: string, unitNumber: string) {
  await sendWhatsApp(
    phone,
    `⚠️ *Bodeguitas — Payment Failed*\n\nWe couldn't process your monthly payment for Unit ${unitNumber}. Please update your payment method or contact us to avoid service interruption.`
  );
}

export async function notifyPaymentReminder(phone: string, unitNumber: string, dueDate: string) {
  await sendWhatsApp(
    phone,
    `📅 *Bodeguitas — Payment Reminder*\n\nYour rent for Unit ${unitNumber} is due on ${dueDate}. We'll charge your card on file automatically.`
  );
}
