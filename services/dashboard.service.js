import { col, fn, literal, Op } from "sequelize"
import dayjs from "dayjs"
import { Address, Book, Category, Order, OrderItem, User } from "../models/index.js"

export const ordersStats = async () => {
  try {
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const thisMonthOrders = await Order.count({
      where: { placed_at: { [Op.gte]: startOfThisMonth } },
    })

    const lastMonthOrders = await Order.count({
      where: { placed_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] } },
    })

    let percentageChange = 0
    let trend = "neutral"

    if (lastMonthOrders > 0) {
      percentageChange = ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
      trend = thisMonthOrders > lastMonthOrders ? "up" : "down"
    }

    return {
      total_orders: thisMonthOrders,
      change: percentageChange.toFixed(2) + "%",
      trend
    }
      
  } catch (err) {
      return err.message
  }
}

export const revenueStats = async () => {
  try {
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const thisMonthRevenue = await Order.sum("total_amount", {
      where: { placed_at: { [Op.gte]: startOfThisMonth } },
    })

    const lastMonthRevenue = await Order.sum("total_amount", {
      where: { placed_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] } },
    })

    let percentageChange = 0
    let trend = "neutral"

    if (lastMonthRevenue > 0) {
      percentageChange = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      trend = thisMonthRevenue > lastMonthRevenue ? "up" : "down"
    }

    return {
      total_revenue: thisMonthRevenue || 0,
      change: percentageChange.toFixed(2) + "%",
      trend,
    }
  } catch (err) {
    return err.message
  }
}

export const activeCustomersStats = async () => {
  try {
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const thisMonthCustomers = await Order.count({
      where: { placed_at: { [Op.gte]: startOfThisMonth } },
      distinct: true,
      col: "user_id",
    })

    const lastMonthCustomers = await Order.count({
      where: { placed_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] } },
      distinct: true,
      col: "user_id",
    })

    let percentageChange = 0
    let trend = "neutral"

    if (lastMonthCustomers > 0) {
      percentageChange = ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
      trend = thisMonthCustomers > lastMonthCustomers ? "up" : "down"
    }

    return {
      active_customers: thisMonthCustomers,
      change: percentageChange.toFixed(2) + "%",
      trend,
    }
  } catch (err) {
    return err.message
  }
}

export const avgConfirmationTime = async () => {
  try {
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const confirmedOrders = await Order.findAll({
      where: {
        placed_at: { [Op.gte]: startOfThisMonth },
        confirmed_at: { [Op.ne]: null },
      },
      attributes: [
        [literal("AVG(EXTRACT(EPOCH FROM (confirmed_at - placed_at)))"), "avg_seconds"],
      ],
      raw: true,
    })

    const avgSeconds = confirmedOrders[0].avg_seconds || 0

    return {
      avg_confirmation_time: `${Math.round(avgSeconds / 60)} minutes`,
    }
  } catch (err) {
    return err.message
  }
}

export async function salesData() {
  try {
    const now = dayjs()
    const sixMonthsAgo = now.subtract(5, "month").startOf("month")

    const stats = await Order.findAll({
      attributes: [
        [fn("DATE_TRUNC", "month", col("placed_at")), "month"],
        [fn("SUM", col("total_amount")), "revenue"],
        [fn("COUNT", col("id")), "orders"],
      ],
      where: {
        placed_at: {
          [Op.between]: [sixMonthsAgo.toDate(), now.endOf("month").toDate()],
        },
      },
      group: [literal("DATE_TRUNC('month', placed_at)")],
      order: [[literal("month"), "ASC"]],
      raw: true,
    })

    const statsMap = new Map()
    stats.forEach(s => {
      statsMap.set(dayjs(s.month).format("MMM"), {
        revenue: Number(s.revenue) || 0,
        orders: Number(s.orders) || 0,
      })
    })

    const salesData = []
    for (let i = 5; i >= 0; i--) {
      const m = now.subtract(i, "month").format("MMM")
      salesData.push({
        month: m,
        revenue: statsMap.get(m)?.revenue || 0,
        orders: statsMap.get(m)?.orders || 0,
      })
    }

    return salesData
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const categoryRevenueStats = async () => {
  try {
  const categories = await Category.findAll({
    attributes: [
      "name",
      [
        fn(
          "COALESCE",
          fn("SUM", col("books->OrderItems.total_price")),
          0
        ),
        "value"
      ]
    ],
    include: [
      {
        model: Book,
        as: "books",
        attributes: [],
        through: { attributes: [] },
        include: [
          {
            model: OrderItem,
            as: "OrderItems",
            attributes: []
          }
        ]
      }
    ],
    group: ["Category.id", "Category.name"],
    raw: true
  })
  const totalRevenue = categories.reduce((sum, c) => sum + parseFloat(c.value), 0)

  return categories.map(c => ({
    name: c.name,
    value: parseFloat(c.value),
    percentage: totalRevenue ? parseFloat(((c.value / totalRevenue) * 100).toFixed(2)) : 0
  }))
  } catch (error) {
    return error.message
  }
}

export const bestSellings = async (limit = 5) => {
  const bestSellers = await OrderItem.findAll({
    attributes: [
      "book_id",
      [fn("SUM", col("quantity")), "sales"],
      [fn("SUM", col("total_price")), "revenue"]
    ],
    include: [
      {
        model: Book,
        as: "books",
        attributes: ["title", "author"]
      }
    ],
    group: ["OrderItem.book_id", "books.id", "books.title", "books.author"],
    order: [[fn("SUM", col("quantity")), "DESC"]],
    limit,
    raw: true,
    nest: true
  });

  return bestSellers.map(item => ({
    title: item.books.title,
    author: item.books.author,
    sales: parseInt(item.sales),
    revenue: parseFloat(item.revenue)
  }))
}

export const customerDistributionByState = async () => {
  const totalCustomers = await User.count({
    distinct: true,
    col: "id",
    include: [{ model: Address, as: "Addresses" }],
  })

  const stateStats = await Address.findAll({
    attributes: [
      "state",
      [fn("COUNT", col("user_id")), "customers_count"],
      [
        literal(`ROUND((COUNT(user_id)::decimal / ${totalCustomers}) * 100, 2)`),
        "percentage",
      ],
    ],
    group: ["state"],
    order: [[fn("COUNT", col("user_id")), "DESC"]],
  })

  return stateStats
}

export const totalCustomers = async () => {
  try {
    const customers = await User.findAll({
      attributes: [
        "id",
        "full_name",
        "email",
        "phone",
        "created_at",
        "is_active",
        [fn("COUNT", col("Orders.id")), "totalOrders"],
        [fn("COALESCE", fn("SUM", col("Orders.total_amount")), 0), "totalSpents"],
      ],
      include: [
        {
          model: Order,
          attributes: [],
          as: "Orders",
        },
        {
          model: Address,
          attributes: ["id", "line1", "line2", "state", "district", "municipality"],
          as: "Addresses",
        },
      ],
      group: ["User.id", "Addresses.id"],
      order: [["created_at", "DESC"]],
      raw: false,
    })

    const now = new Date()
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))

    return customers.map((c) => {
      let status = "inactive"
      if (c.is_active) status = "active"
      if (new Date(c.created_at) >= thirtyDaysAgo) status = "new"

      return {
        id: c.id,
        name: c.full_name,
        email: c.email,
        phone: c.phone,
        created_at: c.created_at,
        status,
        totalOrders: parseInt(c.getDataValue("totalOrders"), 10),
        totalSpents: parseFloat(c.getDataValue("totalSpents")),
        addresses: c.Addresses?.map((a) => ({
          id: a.id,
          line1: a.line1,
          line2: a.line2,
          state: a.state,
          district: a.district,
          municipality: a.municipality,
        })) || [],
      }
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    throw error
  }
}
