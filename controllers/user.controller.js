import User from "../models/userModel.js";
import authService from "../services/auth.service.js"
import { sendVerificationEmail } from "../utils/mailer.js";
import { generateEmailToken } from "../utils/token.js"

async function signup(req, res) {
  try {
    const {user} = await authService.signUp(req.body);

    const emailToken = generateEmailToken(user.id);
    await sendVerificationEmail(user.email, emailToken);

    res.status(201).json({
      message: 'User created. Verify your email and WhatsApp phone before logging in.',
      userId: user.id,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // allow cookies on http:// during development
      sameSite: "lax", // works better for local dev
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.json({ accessToken, user })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}

async function logout(req, res) {
  try {
    const userId = req.user.id
    await authService.logout(userId)
    res.clearCookie("refreshToken")
    res.json({ message: "Logged out" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function refresh(req, res) {
  try {
    const oldToken = req.cookies.refreshToken || req.body.refreshToken
    if (!oldToken) return res.status(401).json({ error: "Refresh token missing" })

    const tokens = await authService.refreshToken(oldToken)
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.json({ accessToken: tokens.accessToken })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}


async function all(req, res) {
  try {
    const users = await User.findAll(); 
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default { signup, login, logout, refresh , all}