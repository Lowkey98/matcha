# Email Verification Setup (Gmail)

To use the email verification system, you need an email account that can send verification emails.

---

## Step 1: Add environment variables

Create a `.env` file in your `server`  folder with:

    EMAIL_USER="example@gmail.com"  # Replace with your actual Gmail address
    EMAIL_PASS="password"            # Replace with your generated app password

---

## Step 2: Generate Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** for the app.
3. Select **Other (Custom name)** and enter a name like `MyApp Email`.
4. Click **Generate**.
5. Copy the 16-character password Google gives you.
6. Paste it as `EMAIL_PASS` in your `.env` file.

