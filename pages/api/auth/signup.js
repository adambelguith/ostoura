import bcryptjs from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';
// import nodemailer from 'nodemailer'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connect();

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    await db.disconnect();
    return;
  }
  // const timestamp = Date.now()
  // const activationToken = generateActivationToken();
  
  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    // activated: false,
    // activationToken,
    //activationTokenCreatedAt: timestamp,
    isAdmin: false,
  });
  // const activationLink = `${process.env.NEXT_PUBLIC_APP_URL}/activate?token=${activationToken}`;
  // await sendActivationEmail(req.body.email, activationLink);
  const user = await newUser.save();
  await db.disconnect();
  res.status(201).send({
    message: 'Created user!',
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
  // function generateActivationToken() {
  //   const length = 32
  //   const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  //   let token = ''
  
  //   for (let i = 0; i < length; i++) {
  //     const randomIndex = Math.floor(Math.random() * charset.length)
  //     token += charset[randomIndex]
  //   }
  
  //   return token
  // }

  // async function sendActivationEmail(email, activationLink) {
  //   const transporter = nodemailer.createTransport({
  //     service: process.env.EMAIL_SERVICE,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  //   })
  
  //   const mailOptions = {
  //     from: process.env.EMAIL_USERNAME,
  //     to: email,
  //     subject: 'Activate your account',
  //     html: `Please click the following link to activate your account: <a href="${activationLink}">${activationLink}</a>`,
  //   }
  
  //   try {
  //     await transporter.sendMail(mailOptions);
  //     console.log(`Activation email sent to ${email}`);
  //   } catch (error) {
  //     console.error(`Failed to send activation email to ${email}: ${error}`);
  //   }
  // }
}

export default handler;
