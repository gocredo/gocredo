import axios from 'axios';

async function verifyCaptcha(captchaToken: string) {
  console.log("Verifying CAPTCHA with token:", captchaToken);
  const response = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY!,
      response: captchaToken,
    })
  );
  console.log("CAPTCHA verification response:", response.data);

  const data = response.data;

  if (!data.success || (data.score !== undefined && data.score < 0.5)) {
    throw new Error('CAPTCHA verification failed');
  }

  return true;
}

export {verifyCaptcha};