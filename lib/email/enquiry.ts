/* The email Jeremiah gets when someone uses the contact form.
   Table layout + inline styles so it renders the same in Gmail, Outlook and
   Apple Mail. Everything the visitor typed is escaped. */

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export interface EnquiryEmail {
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
  siteUrl: string;
}

const wa = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return `https://wa.me/${d.startsWith("0") ? `234${d.slice(1)}` : d}`;
};

export function enquiryEmailHtml(e: EnquiryEmail) {
  const first = e.name.split(" ")[0] || e.name;
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #ececee;font:400 13px/1.4 ${FONT};color:#71717a;width:110px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #ececee;font:500 14px/1.4 ${FONT};color:#09090b;">${value}</td>
    </tr>`;
  const reply = `mailto:${encodeURIComponent(e.email)}?subject=${encodeURIComponent(
    `Re: your ${e.service ? e.service.toLowerCase() : "design"} enquiry`,
  )}&body=${encodeURIComponent(`Hi ${first},\n\nThanks for reaching out!\n\n`)}`;
  const btn = (href: string, label: string, dark: boolean) => `
    <td style="padding-right:8px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="background:${dark ? "#09090b" : "#f4f4f5"};border-radius:14px;">
          <a href="${href}" style="display:inline-block;padding:13px 20px;font:600 14px/1 ${FONT};color:${dark ? "#ffffff" : "#09090b"};text-decoration:none;">${label}</a>
        </td>
      </tr></table>
    </td>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New enquiry</title></head>
<body style="margin:0;padding:0;background:#fafafa;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(e.name)}${e.service ? ` · ${esc(e.service)}` : ""}${e.message ? ` — ${esc(e.message.slice(0, 90))}` : ""}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fafafa;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:28px;border:1px solid #ececee;">
        <tr><td style="padding:32px 36px 0;">
          <span style="display:inline-block;background:#09090b;color:#ffffff;border-radius:999px;padding:7px 13px;font:500 12px/1 ${FONT};">New enquiry</span>
          <h1 style="margin:16px 0 0;font:600 26px/1.15 ${FONT};letter-spacing:-.03em;color:#09090b;">${esc(e.name)} wants to work with you</h1>
        </td></tr>
        <tr><td style="padding:20px 36px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            ${row("Email", `<a href="mailto:${esc(e.email)}" style="color:#09090b;">${esc(e.email)}</a>`)}
            ${e.phone ? row("Phone", `<a href="tel:${esc(e.phone)}" style="color:#09090b;">${esc(e.phone)}</a>`) : ""}
            ${e.service ? row("Service", esc(e.service)) : ""}
            ${e.budget ? row("Budget", esc(e.budget)) : ""}
          </table>
        </td></tr>
        ${
          e.message
            ? `<tr><td style="padding:22px 36px 0;">
          <div style="background:#f4f4f5;border-radius:18px;padding:18px 20px;font:400 15px/1.6 ${FONT};color:#27272a;white-space:pre-wrap;">${esc(e.message)}</div>
        </td></tr>`
            : ""
        }
        <tr><td style="padding:24px 36px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            ${btn(reply, "Reply by email", true)}
            ${e.phone ? btn(wa(e.phone), "WhatsApp", false) : ""}
          </tr></table>
        </td></tr>
        <tr><td style="padding:24px 36px 32px;">
          <p style="margin:0;font:400 13px/1.55 ${FONT};color:#a1a1aa;">Saved to your dashboard under
            <a href="${e.siteUrl}/dashboard/enquiries" style="color:#71717a;">Enquiries</a> — move it along the pipeline once you've replied.</p>
        </td></tr>
      </table>
      <p style="margin:20px 0 0;font:400 12px/1.5 ${FONT};color:#a1a1aa;">Sent by your Acegraphiix website contact form</p>
    </td></tr>
  </table>
</body></html>`;
}
