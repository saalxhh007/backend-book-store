import { sendOrderCreation, sendOrderStatus } from "../utils/mailer.js"
import { Address, Book, Order, OrderItem, User } from "./../models/index.js"

export const createOrder = async (
      user_id,
      status,
      total_amount,
      shipping_cost,
      tax_amount,
      payment_status,
      items
) => {
  try {
      const userAddress = await Address.findOne({
        where: { user_id },
      })
      if (!userAddress) {
        throw new Error("User does not have a shipping address")
      }
      const order = await Order.create({
        user_id,
        status,
        total_amount,
        shipping_cost,
        tax_amount,
        payment_status,
        shipping_address_id: userAddress.id,
  })
  
  const orderItems = await Promise.all(
    items.map(i => {
      OrderItem.create({
        order_id: order.id,
        book_id: i.book_id,
        quantity: i.quantity,
        unit_price: i.price_snapshot,
        total_price: (i.quantity * i.price_snapshot),
        title_snapshot: i.title_snapshot
      })}
    )
  )

    const user = await User.findByPk(user_id)
    await sendOrderCreation(user.email, order.id)

  return { ...order.toJSON(), items: orderItems }
  } catch (error) {
    return error.message
  }
}

export const getOrders = async () => {
  return Order.findAll({
    include: [
      {
        model: OrderItem, as: "OrderItems", include: [{
        model: Book, as: "books"
      }] },
      { model: User, as: "User" },
      { model: Address, as: "ShippingAddress" }]
  })
}

export const getOrderById = async (id) => {
  return Order.findByPk(id, { include: [{ model: OrderItem, as: "OrderItems" }] })
}

export const getMyOrders = async (user_id) => {
    const order = await Order.findAll({
      where: { user_id: user_id },
      include: [{ model: OrderItem, as: "OrderItems" }],
    })
    return order
}

export const getMyOrder = async (user_id, order_id) => {
    const order = await Order.findAll({
      where: {
        id: order_id,
        user_id: user_id,
      },
      include: [
        {
          model: OrderItem, as: "OrderItems", include: [
          { model: Book, as: "books" }
          ]
        },
        {model: Address, as: "ShippingAddress"},
        {model: User, as: "User"}
      ],
    })
    return order
}

export const deleteOrder = async (id) => {
  return Order.destroy({ where: { id } })
}

export const shippingInfo = async (user_id) => {
  try {
    const user = await User.findOne({
      where: { id: user_id },
      attributes: ["full_name", "email", "phone"],
      include: [
        {
          model: Address,
          as: "Addresses",
          attributes: ["line1", "state", "district", "municipality"],
        },
      ],
    })

    if (!user) {
      throw new Error("User not found");
    }

    let firstName = ""
    let lastName = ""
    if (user.full_name) {
      const parts = user.full_name.trim().split(" ");
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ") || "";
    }

    const address = user.Addresses?.[0]

    return {
      user: {
        firstName,
        lastName,
        email: user.email,
        phone: user.phone,
      },
      address: {
      address: address?.line1 || "",
      state: address?.state || "",
      district: address?.district || "",
      municipality: address?.municipality || "",
    }
    }
  } catch (error) {
    console.error("Error fetching shipping info:", error.message)
    throw error
  }
}

export const updateAddress = async (user_id, addressData) => {
  try {
    let address = await Address.findOne({ where: { user_id } })
    
    if (address) {
      await address.update({
        line1: addressData.line1,
        line2: addressData.line2,
        state: addressData.state,
        district: addressData.district,
        municipality: addressData.municipality,
      })
    }
    else {
      address = await Address.create({
        user_id,
        line1: addressData.line1,
        line2: addressData.line2,
        state: addressData.state,
        district: addressData.district,
        municipality: addressData.municipality,
      })
    }

    return address
    
  } catch (error) {
    console.error("Error updating address:", error)
    throw error
  }
}

export const updateStatus = async (order_id, status, reason) => {
  try {
    let order = await Order.findByPk(order_id)

    if (!order) {
      throw new Error("Order not found")
    }

    const user_id = order.user_id

    order.status = status
    order.confirmed_at = new Date()
    await order.save()

    const user = await User.findByPk(user_id)

    if (!user) {
      throw new Error("User not found")
    }

    if (status === "Confirmed") {
      const userAddress = await Address.findOne({
        where: { user_id },
      })

      if (!userAddress) {
        throw new Error("User does not have a shipping address")
      }

      await sendOrderStatus(user.email, order.id, status, reason, userAddress)
    } else {
      await sendOrderStatus(user.email, order.id, status, reason)
    }

    return order
  } catch (error) {
    console.error("Error updating status:", error)
    throw error
  }
}
