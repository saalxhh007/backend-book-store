import { Book, Category } from "../models/index.js"

const createBook = async (bookData, categoryIds) => {
  const book = await Book.create(bookData)
  if (Array.isArray(categoryIds) && categoryIds.length > 0) {
    const categories = await Category.findAll({ where: { id: categoryIds } })
    if (typeof book.setCategories === "function") {
      await book.setCategories(categories)
    }
    else {
      await Promise.all(
        categories.map(category =>
          book.addCategory ? book.addCategory(category) : null
        )
      )
    }
  }
  return await Book.findByPk(book.id, {
    include: { model: Category, as: "categories" }
  })
}

const getBookById = async (id) => {
  return await Book.findByPk(id, {
    include: [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ],
  })
}

const updateBook = async (id, updates, categoryIds) => {
  const book = await Book.findByPk(id)
  if (!book) return null

  await book.update(updates)

  if (categoryIds) {
    const categories = await Category.findAll({ where: { id: categoryIds } })
    await book.setCategories(categories)
  }
  return book
}

const deleteBook = async (id) => {
  const book = await Book.findByPk(id)
  if (!book) return null
  await book.destroy()
  return book
}

export default { createBook, getBookById, updateBook, deleteBook }