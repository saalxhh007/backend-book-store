import wishlistService from "../services/wishlist.service.js";
    
export const addToWishlist = async (req, res) => {
  try {
    const user_id = req.user.id
    const { book_id } = req.body
    const item = wishlistService.addToWishlist(user_id, book_id)
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user_id = req.user.id

    const items = await wishlistService.getWishlist(user_id)

    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params
    await wishlistService.removeFromWishlist(id)
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const clearWishlist = async (req, res) => {
  try {
    const user_id = req.user.id

    await wishlistService.clearWishlist(user_id)
    res.json({ message: "Cart cleared" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}