import bookService from "../services/book.service.js"
import { Category } from "../models/index.js";
import { Book } from "../models/index.js";

export const createBook = async (req, res) => {  
  try {
    let { categories, ...bookData } = req.body
    if (typeof categories === "string") {
      try {
        if (categories.trim().startsWith("[")) {
          categories = JSON.parse(categories);
        } else {
          categories = categories
            .split(",")
            .map(id => Number(id.trim()))
            .filter(Boolean);
        }
      } catch {
        categories = []
      }
    } else if (!Array.isArray(categories)) {
      categories = [];
    }
    
    if (req.file) {
      bookData.cover_image = `/uploads/books/${req.file.filename}`
    }
    
    const book = await bookService.createBook(bookData, categories)
    res.status(201).json(book)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getBooks = async (req, res) => {
  try {
    const { category } = req.query

    let include = {
      model: Category,
      as: "categories",
      through: { attributes: [] }
    }

    if (category) {
      include.where = { slug: category }
    }

    const books = await Book.findAll({
      include: [include],
      order: [["created_at", "DESC"]]
    })

    if (!books.length) {
      return res.status(404).json({ message: "No books found" })
    }

    res.status(200).json(books);

  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching books", error: error.message })
  }
}

export const getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id)
    if (!book) return res.status(404).json({ message: "Book not found" })
    res.json(book)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateBook = async (req, res) => {
  try {
    const { categories, ...updates } = req.body
    const book = await bookService.updateBook(req.params.id, updates, categories)
    if (!book) return res.status(404).json({ message: "Book not found" })
    res.json(book)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteBook = async (req, res) => {
  try {
    const book = await bookService.deleteBook(req.params.id)
    if (!book) return res.status(404).json({ message: "Book not found" })
    res.json({ message: "Book deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}