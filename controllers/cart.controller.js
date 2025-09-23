import cartService from "../services/cart.service.js"

export const addToCart = async (req, res) => {
  try {
    const { book_id, quantity } = req.body
    const user_id = req.user.id
    const cartItem = await cartService.addToCart(book_id, user_id, quantity)
    res.status(201).json(cartItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getCart = async (req, res) => {
  try {
    const user_id = req.user.id
    
    const items = await cartService.getCart(user_id)
    res.status(201).json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user.id

    await cartService.removeFromCart(id, user_id)
    res.json({ message: "Item removed" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const clearCart = async (req, res) => {
  try {
    const user_id = req.user.id
    await cartService.clearCart(user_id)
    res.json({ message: "Cart cleared" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateQuantity = async (req, res) => {
  try {
    const user_id = req.user.id
    const { quantity, book_id } = req.body

    await cartService.updateQuantity(user_id, book_id, quantity )
    res.json({ message: "Quantity Updated" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}