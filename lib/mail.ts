import nodemailer from "nodemailer";
import { isSmtpConfigured } from "@/lib/env";

const smtpPort = Number(process.env.SMTP_PORT ?? 587);

export const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export type NotificationType = "komentar" | "gagasan";
export type ModerationStatus = "APPROVED" | "REJECTED";

export async function sendMail({ to, subject, html, text }: SendMailInput) {
  if (!isSmtpConfigured()) {
    console.warn("[mail] SMTP belum dikonfigurasi. Email dilewati:", subject);
    return null;
  }

  const from =
    process.env.SMTP_FROM ??
    process.env.SMTP_USER ??
    "noreply@majelisarah.id";

  return mailTransporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
}

function typeLabel(type: NotificationType) {
  return type === "komentar" ? "Komentar" : "Gagasan";
}

/** Notifikasi ke admin saat ada submit baru */
export async function sendAdminNotification(
  type: NotificationType,
  title: string,
) {
  const adminEmail =
    process.env.ADMIN_EMAIL ??
    process.env.SMTP_USER ??
    "admin@mai.com";

  const label = typeLabel(type);
  const subject = `[MAI] ${label} baru menunggu moderasi`;
  const html = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin: 0 0 12px;">${label} baru masuk</h2>
      <p>Ada <strong>${label.toLowerCase()}</strong> baru yang menunggu persetujuan Anda.</p>
      <p><strong>Judul / cuplikan:</strong> ${title}</p>
      <p>Silakan buka panel CMS Admin untuk meninjau.</p>
    </div>
  `;

  try {
    await sendMail({
      to: adminEmail,
      subject,
      html,
      text: `${label} baru: ${title}`,
    });
  } catch (error) {
    console.error("[mail] sendAdminNotification gagal:", error);
  }
}

/** Notifikasi ke user saat moderasi selesai */
export async function sendUserNotification(
  email: string,
  type: NotificationType,
  title: string,
  status: ModerationStatus,
) {
  const label = typeLabel(type);
  const approved = status === "APPROVED";
  const subject = approved
    ? `[MAI] ${label} Anda disetujui`
    : `[MAI] ${label} Anda ditolak`;

  const html = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin: 0 0 12px;">Status ${label.toLowerCase()} diperbarui</h2>
      <p>
        ${label} Anda
        <strong>"${title}"</strong>
        telah
        <strong style="color: ${approved ? "#75B13D" : "#F96B2A"};">
          ${approved ? "DISETUJUI" : "DITOLAK"}
        </strong>.
      </p>
      <p>Terima kasih telah berpartisipasi di portal Majelis Arah Indonesia.</p>
    </div>
  `;

  try {
    await sendMail({
      to: email,
      subject,
      html,
      text: `${label} "${title}" ${approved ? "disetujui" : "ditolak"}.`,
    });
  } catch (error) {
    console.error("[mail] sendUserNotification gagal:", error);
  }
}

export async function sendVerificationEmail(email: string, verifyUrl: string) {
  const subject = "[MAI] Verifikasi email akun Anda";
  const html = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin: 0 0 12px;">Verifikasi email</h2>
      <p>Terima kasih telah mendaftar di portal Majelis Arah Indonesia.</p>
      <p>Klik tautan berikut untuk mengaktifkan akun (berlaku 24 jam):</p>
      <p>
        <a href="${verifyUrl}" style="display:inline-block;background:#75B13D;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;">
          Verifikasi email
        </a>
      </p>
      <p style="font-size: 12px; color: #64748b;">Jika tombol tidak berfungsi, salin tautan ini:<br>${verifyUrl}</p>
    </div>
  `;

  const sent = await sendMail({
    to: email,
    subject,
    html,
    text: `Verifikasi email MAI: ${verifyUrl}`,
  });

  if (!sent) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }
}
