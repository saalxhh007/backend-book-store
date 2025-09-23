import { sendVerificationEmail } from "../utils/mailer.js"
import { generateEmailToken } from "../utils/token.js"
import { Address, Book, Order, OrderItem, User } from "./../models/index.js"
import hashUtils from "./../utils/hash.js"

export const myProfile = async (user_id) => {
    const user = User.findAll({
        where: { id: user_id },
        attributes: ["id", "full_name", "email", "phone"],
        include: [
            {
                model: Address,
                as: "Addresses",
                attributes: ["line1", "line2", "state", "district", "municipality"]
            }
        ]
    })
    return user
}

export const recomendations = async (user_id) => {
    const orders = await Order.findAll({
        where: { user_id },
        include: [
            {
                model: OrderItem,
                as: "OrderItems",
                include: [{ model: Book, as: "books" }]
            }
        ]
    })
    if (!orders.length) return []
    
    const purchasedBooks = orders.flatMap(o => o.OrderItems.map(i => i.books))
    const categories = new Set(purchasedBooks.flatMap(b => b.categories?.map(c => c.id) || []))
    
    const recommendations = await Book.findAll({
        include: [
            {
                association: "categories",
                where: { id: Array.from(categories) }
            }
        ],
        limit: 10
    })
    return recommendations
}

export const orderHistory = async (user_id) => {
    const order = await Order.findAll({
        where: { user_id },
      include: [
          {
            model: OrderItem,
            as: "OrderItems",
            include: [{ model: Book, as: "books", attributes: ["title", "author", "price"] }]
          }
      ],
      order: [["placed_at", "DESC"]]
  })
    return order
}

export const updatePassword = async (user_id, oldPassword, newPassword) => {
  const user = await User.findByPk(user_id)
  if (!user) throw new Error("User not found")
    
  const isMatch = await hashUtils.compareValue(oldPassword, user.password_hash)
  if (!isMatch) throw new Error("Old password is incorrect")

  const hashedPassword = await hashUtils.hashValue(newPassword)
  user.password_hash = hashedPassword
  await user.save()

  return { message: "Password updated successfully" }
}

export const updateAddress = async (user_id, addressData) => {
  let address = await Address.findOne({ where: { user_id } })

  if (!address) {
    address = await Address.create({ ...addressData, user_id })
  } else {
    await address.update(addressData)
  }
  return address
}

export const updateEmail = async (user_id, newEmail) => {
  const user = await User.findByPk(user_id)
    if (!user) throw new Error("User not found")
    

    user.email = newEmail
    user.is_active = false
    await user.save()
    
    const emailToken = generateEmailToken(user.id);
    await sendVerificationEmail(user.email, emailToken);

    return { message: "Email updated successfully" }
}