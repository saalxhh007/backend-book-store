import { json } from "express"
import CartItem from "../models/CartItemModel.js"
import Book from "../models/book/BookModel.js"

const addToCart = async (book_id, user_id, quantity) => {
    const book = await Book.findByPk(book_id)
    if (!book) return json({ error: "Book not found" })

    let cartItem = await CartItem.findOne({ where: { user_id, book_id } })

    if (cartItem) {
      cartItem.quantity += quantity
      await cartItem.save()
    } else {
      cartItem = await CartItem.create({
        user_id,
        book_id,
        quantity,
        price_snapshot: book.price,
      })
    }
    return cartItem
}

const getCart = async (id) => {
    const items = await CartItem.findAll({
      where: { user_id: id },
      include: [{ model: Book, as: "book" }],
    })
    return items
}

const removeFromCart = async (id, user_id) => {
    const item = await CartItem.findOne({ where: { id, user_id } })
    if (!item) return json({ error: "Item not found" })
    await item.destroy()
    return true
}

export const clearCart = async (user_id) => {
    await CartItem.destroy({ where: { user_id } })
    return true
}

export const updateQuantity = async (user_id, book_id, quantity) => {
  let cartItems = await CartItem.findAll({
    where: {
      user_id: user_id,
      book_id: book_id
    }
  })

  if (cartItems.length === 0) return json({ error: "Item not found" })

  let cartItem = cartItems[0]
  cartItem.quantity = quantity
  await cartItem.save()

  return cartItem
}


export default { addToCart, getCart, clearCart, removeFromCart, updateQuantity }