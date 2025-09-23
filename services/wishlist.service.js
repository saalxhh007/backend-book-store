import Book from "../models/book/BookModel.js";
import Wishlist from "../models/wishlistModel.js";

const addToWishlist = async (userId, bookId) => {
    const exists = await Wishlist.findOne({ where: { user_id: userId, book_id: bookId } });
    if (exists) return json({ message: "Already in wishlist" });

    const item = await Wishlist.create({ user_id: userId, book_id: bookId })
    return item
}

const getWishlist = async ( user_id ) => {
    const items = await Wishlist.findAll({
      where: { user_id },
      include: [{ model: Book, as: "book" }],
    })
    return items
}

const removeFromWishlist = async (id) => {
    const item = await Wishlist.findOne({ where: { id } })
    if (!item) return json({ error: "Item not found" })
    await item.destroy()
    return true
}

const clearWishlist = async (user_id) => {
    await Wishlist.destroy({ where: { user_id } })
    return true
}

export default { addToWishlist, getWishlist, removeFromWishlist, clearWishlist }