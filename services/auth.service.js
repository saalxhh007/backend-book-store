import jwt from "jsonwebtoken"

import User from "../models/userModel.js";
import jwtTokens from "./../config/jwt.js"
import hashUtils from "./../utils/hash.js"
// import getClient from "../utils/whatsappClient.js";
import normalizeNum from "../utils/phoneUtils.js";
import authService from "./../utils/hash.js"
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import Address from "../models/addressModel.js";

// const verificationCodes = new Map()

async function signUp({ email, password, full_name, phone, address }) {
    const existing = await User.findOne({ where: { email } })
    if (existing) throw new Error("Email Already In Use")

    const hashedPassword = await hashUtils.hashValue(password)
    const normalizedPhone = normalizeNum(phone)
    
    const user = await User.create({
      email,
      phone: normalizedPhone,
      password_hash: hashedPassword,
      full_name,
      is_email_verified: false,
      is_phone_verified: false,
    })
  
    const add = await Address.create({
      user_id: user.id,
      line1: address.line1,
      line2: address.line2,
      state: address.state,
      district: address.district,
      municipality: address.municipality
    })
  
    // const verificationCode = Math.floor(10000 + Math.random() * 90000).toString()
    // verificationCodes.set(user.email, verificationCode)
    // await sendWhatsAppVerification(normalizedPhone, verificationCode)

    return {user, add}
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } })
  if (!user) throw new Error("Invalid Credentials")
  
  if (!user.is_email_verified ) {
    throw new Error("Verify your email and phone number first")
  }
  
  const passwordValid = await authService.compareValue(password, user.password_hash)
  if (!passwordValid) throw new Error("Invalid Credentials")
  
  const payload = { id: user.id, email: user.email, fullName: user.full_name, role: user.role }
  const accessToken = generateAccessToken(payload)
  const refreshTokenPlain = generateRefreshToken(payload)
  
  const refreshTokenHash = await hashUtils.hashValue(refreshTokenPlain)
  user.refresh_token = refreshTokenHash
  await user.save()

  return { accessToken, refreshToken: refreshTokenPlain, user: { ...payload, role: user.role } }
}

async function logout(userId) {
  const user = await User.findByPk(userId)
  if (!user) throw new Error("User not found")

  user.refreshToken = null
  await user.save()
}

async function refreshToken(oldToken) {
  try {
    const payload = jwt.verify(oldToken, jwtTokens.refreshTokenSecret)

    const foundUser = await User.findByPk(payload.id)
    if (!foundUser || !foundUser.refresh_token) throw new Error("Invalid token")

    const match = await authService.compareValue(oldToken, foundUser.refresh_token)
    if (!match) throw new Error("Invalid token")

    const { exp, iat, ...userPayload } = payload

    const newAccessToken = generateAccessToken(userPayload)
    const newRefreshTokenPlain = generateRefreshToken(userPayload)
    const newRefreshTokenHash = await hashUtils.hashValue(newRefreshTokenPlain)

    foundUser.refresh_token = newRefreshTokenHash
    await foundUser.save()

    return { accessToken: newAccessToken, refreshToken: newRefreshTokenPlain }
  } catch (err) {
    throw new Error(`${err}`)
  }
}

async function verifyEmail(token) {
  const payload = jwt.verify(token, process.env.EMAIL_SECRET);
  const user = await User.findByPk(payload.userId);
  if (!user) throw new Error("Invalid token");
  user.is_email_verified = true;
  await user.save();
  return user;
}

// async function verifyWhatsAppCode(email, code) {
//   const savedCode = verificationCodes.get(email);

//   if (savedCode && savedCode === code) {
//     const user = await User.findOne({ where: { email } });
//     if (!user) throw new Error('User not found');

//     user.is_phone_verified = true;
//     await user.save();

//     verificationCodes.delete(email);
//     return user;
//   } else {
//     throw new Error('Invalid verification code');
//   }
// }

// async function sendWhatsAppVerification(phone, code) {
//   const client = await getClient();

//   const waId = phone.replace(/^\+/, '') + '@c.us';

//   const message = `Your BookStore verification code is: *${code}*`;

//   try {
//     await client.sendText(waId, message);
//   } catch (error) {
//     console.error('Failed to send WhatsApp message:', error);
//     throw new Error('WhatsApp message sending failed');
//   }
// }

export default {
    signUp,
    login,
    logout,
    refreshToken,
    verifyEmail,
    // verifyWhatsAppCode,
}
