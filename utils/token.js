import jwt from 'jsonwebtoken'
import jwtTokens from "./../config/jwt.js"

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtTokens.accessTokenSecret, {
    expiresIn: jwtTokens.accessTokenExpiry,
  })
}

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtTokens.refreshTokenSecret, {
    expiresIn: jwtTokens.refreshTokenExpiry,
  })
}

export const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtTokens.accessTokenSecret)
}

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtTokens.refreshTokenSecret)
}

export const generateEmailToken = (userId) => {
  return jwt.sign({ userId }, process.env.EMAIL_SECRET, { expiresIn: "1d" });
}