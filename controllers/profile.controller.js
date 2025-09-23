import { myProfile, orderHistory, recomendations, updateEmail, updatePassword } from "../services/profile.service.js"

export const getMyProfile = async (req, res) => {
    try {
        const user_id = req.user.id
        const profile = await myProfile(user_id)
        if (!profile) return res.status(404).json({ error: "User not found" })
        res.json(profile)
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getRecomendations = async (req, res) => {
  try {
    const user_id = req.user.id
    const recomendation = await recomendations(user_id)
    if (!recomendation) return res.status(404).json({ error: "No Recomendations for this user" })
    res.json(recomendation)
  } catch (error) {
        res.status(500).json({ error: error.message })
  }
}

export const getOrderHistory = async (req, res) => {
    try {
        const user_id = req.user.id
        const order = await orderHistory(user_id)
        if (!order) return res.status(404).json({ error: "Order not found" })
        res.json(order)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// export const getMyReviews = async (req, res) => {
//   try {
//     const user_id = req.user.id
//     const reviews = await profileService.myReviews(user_id)
//     if (!reviews) return res.status(404).json({ error: "Reviews not found" })
//     res.json(reviews)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }

// export const PatchUpdatePassword = async (req, res) => {
//     const user_id = req.user.id
//     const { oldPassword, newPassword } = req.body
//     const password = await updateAddress(user_id, oldPassword, newPassword)
//     if (!password) return res.status(404).json({ error: "Reviews not found" })
//     res.json(password)
//   try {
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// }

export const PatchUpdatePassword = async (req, res) => {
    const user_id = req.user.id
    const {oldPassword, newPassword} = req.body
    const reviews = await updatePassword(user_id, oldPassword, newPassword)
  if (!reviews) return res.status(404).json({ error: "Reviews not found" })
    res.json(reviews)
  try {
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const PatchUpdateEmail = async (req, res) => {
    const user_id = req.user.id
    const { newEmail } = req.body
    
    const email = await updateEmail(user_id, newEmail)
    if (!email) return res.status(404).json({ error: "Reviews not found" })
    res.json(email)

  try {
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}