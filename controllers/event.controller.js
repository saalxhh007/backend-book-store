import { col, fn, Op } from "sequelize";
import { Book, BookCategory, Category, Event } from "../models/index.js";

export const logEvent = async (req, res) => {
  try {
    const {
      type,
      user_id = null,
      book_id = null,
      order_id = null,
      metadata = {}
    } = req.body

    const event = await Event.create({
      type,
      user_id,
      book_id,
      order_id,
      session_id: req.sessionID || null,
      ip: req.ip,
      user_agent: req.headers["user-agent"],
      metadata
    })

    res.status(201).json({ success: true, event })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

export const getEvents = async (req, res) => {
  try {
    const { type, user_id, book_id } = req.query

    const where = {}
    if (type) where.type = type
    if (user_id) where.user_id = user_id
    if (book_id) where.book_id = book_id

    const events = await Event.findAll({
      where,
      order: [["created_at", "DESC"]],
      limit: 100
    })

    res.json({ success: true, events })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

export const logBookView = async ( req, res ) => {
  try {
    const { book_id } = req.body

    const event = await Event.create({
      type: "view_book",
      user_id: null,
      book_id,
      session_id: null,
      ip: null,
      user_agent: null,
      metadata: {}
    })
    res.json({ event })
  } catch (err) {
    console.error("Error logging book view:", err.message);
  }
}

export const logBookPurchase = async ({ user_id, book_id, req, res }) => {
  try {
    const event = await Event.create({
      type: "purchase_book",
      user_id: user_id,
      book_id,
      session_id: req.sessionID || null,
      ip: req.ip,
      user_agent: req.headers["user-agent"],
      metadata: {}
    })
    res.json({ event })
  } catch (err) {
    console.error("Error logging book view:", err.message);
  }
}

// Popular Books
export const getPopularBooks = async (req, res) => {
  try {
    const events = await Event.findAll({
      attributes: [
        "book_id",
        [fn("COUNT", col("book_id")), "eventCount"]
      ],
      where: {
        type: { [Op.in]: ["view_book"] }
      },
      group: ["book_id"],
      order: [[fn("COUNT", col("book_id")), "DESC"]],
      limit: 10
    })
    const books = await Book.findAll({
      where: { id: events.map(e => e.book_id) }
    })

    res.json({ books })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Recomendation Books
export const getRecommendations = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const categories = await BookCategory.findAll({
      where : { book_id: bookId }
    })
    if (categories.length === 0) {
      res.json(false)
    }
    const categoryIds = categories.map(e => e.category_id)
    
    const books = await Book.findAll({
      include: [{
        model: Category,
        as: "categories",
        where: { id: categoryIds },
        attributes: []
      }],
      where: { id: { [Op.ne]: bookId } },
      limit: 10,
      distinct: true
    })

    res.json({ books })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
