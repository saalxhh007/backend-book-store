import * as orderService from "./../services/order.service.js"
import cartService from "../services/cart.service.js"

export const createOrder = async (req, res) => {
  try {
    const user_id = req.user.id
    const { status,
      total_amount,
      shipping_cost,
      tax_amount,
      payment_status,
      items } = req.body
    const order = await orderService.createOrder(
      user_id,
      status,
      total_amount,
      shipping_cost,
      tax_amount,
      payment_status,
      items
    )
    await cartService.clearCart(user_id)
    res.status(201).json(order)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders()
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getMyOrders = async (req, res) => {
    try {
        const user_id = req.user.id
        const orders = await orderService.getMyOrders(user_id)
        if (!orders) return res.status(404).json({ error: "No Orders Found" })
        res.json(orders)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getMyOrder = async (req, res) => {
    try {
        const user_id = req.user.id
        const order_id = req.params.order_id
        const order = await orderService.getMyOrder(user_id, order_id)
        if (!order) return res.status(404).json({ error: "Order not Found" })
        res.json(order)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id)
    if (!order) return res.status(404).json({ error: "Order not found" })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteOrder = async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const shippingInfo = async (req, res) => {
  try {
    const user_id = req.user.id
    const shippingInfo = await orderService.shippingInfo(user_id)
    res.json(shippingInfo)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateAddress = async (req, res) => {
  try {
    const user_id = req.user.id
    const addressData = req.body
    const address = await orderService.updateAddress(user_id, addressData)
    res.json(address)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateStatus = async (req, res) => {
  try {
    const {order_id, status, reason} = req.body
    await orderService.updateStatus(order_id, status, reason)
    res.json(true)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
