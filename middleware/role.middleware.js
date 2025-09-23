const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: "Access denied. No role found." })
      }
      
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." })
      }

      next()
    } catch (error) {
      res.status(500).json({ message: "Role authorization error", error: error.message })
    }
  }
}

export default roleMiddleware