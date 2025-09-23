import jwt from "jsonwebtoken"
import jwtTokens from "./../config/jwt.js"

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    
    if (!token) return res.status(401).json({ message: "Access token missing" })
  
    jwt.verify(token, jwtTokens.accessTokenSecret, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" })
    req.user = user
    next()
  })
}

export default authMiddleware
