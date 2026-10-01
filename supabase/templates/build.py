# Generates the Supabase auth email templates in this folder.
# Run:  python supabase/templates/build.py
# Then paste each .html into Supabase → Authentication → Email Templates.
import pathlib

HERE = pathlib.Path(__file__).parent
FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"

def page(preheader, title, intro, code, button_label, link, note, footer_extra=""):
    code_block = ""
    if code:
        code_block = f"""
          <tr><td style="padding:0 40px;">
            <p style="margin:0 0 10px;font:500 12px/1 {FONT};letter-spacing:.08em;text-transform:uppercase;color:#71717a;">Your code</p>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
              <td align="center" style="background:#f4f4f5;border-radius:18px;padding:22px 12px;">
                <span style="font:600 34px/1 'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:.32em;color:#09090b;">{{{{ .Token }}}}</span>
              </td>
            </tr></table>
            <p style="margin:12px 0 0;font:400 13px/1.5 {FONT};color:#71717a;">Type it on the sign-in screen. It expires in 1 hour and works once.</p>
          </td></tr>
          <tr><td style="padding:26px 40px 0;"><div style="height:1px;background:#e4e4e7;line-height:1px;font-size:0;">&nbsp;</div></td></tr>
          <tr><td style="padding:22px 40px 0;"><p style="margin:0;font:400 14px/1.5 {FONT};color:#52525b;">Or skip the code and use the button:</p></td></tr>"""
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>{title}</title>
</head>
<body style="margin:0;padding:0;background:#fafafa;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">{preheader}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fafafa;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px;background:#ffffff;border-radius:28px;border:1px solid #ececee;">
        <tr><td style="padding:36px 40px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td width="44" height="44" align="center" valign="middle" style="background:#09090b;border-radius:13px;font:700 20px/44px {FONT};color:#ffffff;">A</td>
            <td style="padding-left:12px;">
              <p style="margin:0;font:600 15px/1.2 {FONT};color:#09090b;">Acegraphiix</p>
              <p style="margin:2px 0 0;font:400 13px/1.2 {FONT};color:#71717a;">Website manager</p>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:28px 40px 0;">
          <h1 style="margin:0;font:600 26px/1.15 {FONT};letter-spacing:-.03em;color:#09090b;">{title}</h1>
          <p style="margin:12px 0 24px;font:400 15px/1.55 {FONT};color:#52525b;">{intro}</p>
        </td></tr>
        {code_block}
        <tr><td style="padding:16px 40px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="background:#09090b;border-radius:14px;">
              <a href="{link}" style="display:inline-block;padding:14px 26px;font:600 14px/1 {FONT};color:#ffffff;text-decoration:none;">{button_label} &rarr;</a>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:28px 40px 36px;">
          <p style="margin:0;font:400 13px/1.55 {FONT};color:#a1a1aa;">{note}</p>
          {footer_extra}
        </td></tr>
      </table>
      <p style="margin:20px 0 0;font:400 12px/1.5 {FONT};color:#a1a1aa;">Sent by the Acegraphiix website &middot; Port Harcourt, Nigeria</p>
    </td></tr>
  </table>
</body>
</html>
"""

CB = "{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}"
NOT_YOU = "Didn't ask for this? You can ignore this email. Nobody can sign in without the code or link above."

templates = {
    # Supabase → "Confirm signup". Sent the FIRST time an email signs in.
    "confirm-signup.html": dict(
        subject="Your Acegraphiix sign-in code: {{ .Token }}",
        preheader="Your code is {{ .Token }} — confirm your email to open the dashboard.",
        title="Confirm your email",
        intro="You're signing in to the Acegraphiix website dashboard for the first time. Use this code to confirm it's you.",
        code=True, button_label="Confirm and sign in",
        link=CB + "&type=email&next=/dashboard", note=NOT_YOU),
    # Supabase → "Magic Link". Every sign-in after the first.
    "magic-link.html": dict(
        subject="Your Acegraphiix sign-in code: {{ .Token }}",
        preheader="Your code is {{ .Token }}.",
        title="Your sign-in code",
        intro="Here's your code for the Acegraphiix website dashboard.",
        code=True, button_label="Sign in",
        link=CB + "&type=email&next=/dashboard", note=NOT_YOU),
    # Supabase → "Reset Password".
    "reset-password.html": dict(
        subject="Reset your Acegraphiix dashboard password",
        preheader="Choose a new password for the website dashboard.",
        title="Reset your password",
        intro="Someone (hopefully you) asked to reset the password for the Acegraphiix website dashboard. The button below lets you choose a new one.",
        code=False, button_label="Choose a new password",
        link=CB + "&type=recovery&next=/login/reset",
        note="This link expires in 1 hour. If you didn't ask for a reset, ignore this email — your password stays the same."),
    # Supabase → "Invite user". If you invite someone from the Supabase dashboard.
    "invite.html": dict(
        subject="You've been invited to the Acegraphiix website dashboard",
        preheader="Accept the invite to start editing the site.",
        title="You're invited",
        intro="You've been invited to help manage the Acegraphiix website. Accept the invite to sign in — you'll only be able to edit once your email is on the admin list.",
        code=False, button_label="Accept invite",
        link=CB + "&type=invite&next=/dashboard",
        note="This invite expires in 24 hours."),
    # Supabase → "Change Email Address".
    "change-email.html": dict(
        subject="Confirm your new email for the Acegraphiix dashboard",
        preheader="Confirm the switch to {{ .NewEmail }}.",
        title="Confirm your new email",
        intro="Confirm that you want to change your dashboard sign-in from {{ .Email }} to <b style=\"color:#09090b;\">{{ .NewEmail }}</b>.",
        code=False, button_label="Confirm new email",
        link=CB + "&type=email_change&next=/dashboard",
        note="Remember to add the new email to the admins table too, or the dashboard will lock you out. Didn't ask for this? Ignore this email."),
}

lines = ["# Subjects — paste into the Subject field of each Supabase template\n"]
for name, t in templates.items():
    html = page(t["preheader"], t["title"], t["intro"], t["code"], t["button_label"], t["link"], t["note"])
    (HERE / name).write_text(html, encoding="utf-8")
    lines.append(f"{name:<22} {t['subject']}")
(HERE / "SUBJECTS.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
print("wrote", len(templates), "templates")
