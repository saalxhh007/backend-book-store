import {
  ordersStats,
  revenueStats,
  activeCustomersStats,
  avgConfirmationTime,
  salesData,
  categoryRevenueStats,
  bestSellings,
  customerDistributionByState,
  totalCustomers,
} from "../services/dashboard.service.js"

export const getOrdersStats = async (req, res) => {
  try {
    const stats = await ordersStats()
    res.status(201).json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRevenueStats = async (req, res) => {
  try {
    const stats = await revenueStats()
    res.status(201).json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getActiveCustomersStats = async (req, res) => {
  try {
    const stats = await activeCustomersStats()
    res.status(201).json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getAvgConfirmationTime = async (req, res) => {
  try {
    const stats = await avgConfirmationTime()
    res.status(201).json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getSalesData = async (req, res) => {
  try {
    const sales = await salesData()
    return res.json(sales)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getCategoryRevenueStats = async (req, res) => {
  try {
    const formatted = await categoryRevenueStats() 
    res.json(formatted)
  } catch (error) {
    console.error("Error fetching category revenue:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getBestSellings = async (req, res) => {
  try {
    const bestSellers = await bestSellings()
    res.json(bestSellers)
  } catch (error) {
    console.error("Error fetching best sellings:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
export async function getCustomerDistributionByState(req, res) {
  try {
    const stateStats = await customerDistributionByState()
    res.json(stateStats)
  } catch (error) {
    console.error("Error fetching Customer Distribution By State:", error)
    res.status(500).json({ error: "Internal server error" })  
  }
}

export const getTotalCustomers = async (req, res) => {
  try {
    const customers = await totalCustomers()
    res.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    res.status(500).json({ error: "Internal server error" })
  }
} 