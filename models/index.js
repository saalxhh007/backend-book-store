import db from "../config/db.js";

import BookCategory from "./book/BookCategory.js";
import Book from "./book/BookModel.js";
import Category from "./book/CategoryModel.js";
import User from "./userModel.js";
import Wishlist from "./wishlistModel.js";
import Event from "./eventModel.js";
import OrderItem from "./orderItem.js";
import Order from "./orderModel.js";
import Address from "./addressModel.js";

Book.belongsToMany(Category, {
  through: BookCategory,
  foreignKey: "book_id",
  otherKey: "category_id",
  as: "categories"
})

Category.belongsToMany(Book, {
  through: BookCategory,
  foreignKey: "category_id",
  otherKey: "book_id",
  as: "books"
})

Wishlist.belongsTo(User, { foreignKey: "user_id", as: "user" })
Wishlist.belongsTo(Book, { foreignKey: "book_id", as: "book" })

User.hasMany(Wishlist, { foreignKey: "user_id", as: "wishlists" })
Book.hasMany(Wishlist, { foreignKey: "book_id", as: "wishlists" })

Book.hasMany(Event, { foreignKey: "book_id", as: "events" })
Event.belongsTo(Book, { foreignKey: "book_id", as: "book" })

Order.hasMany(OrderItem, { foreignKey: "order_id", as: "OrderItems" })
OrderItem.belongsTo(Order, { foreignKey: "order_id" })

Order.belongsTo(Address, { foreignKey: "shipping_address_id", as: "ShippingAddress" })

Address.belongsTo(User, { foreignKey: "user_id", as: "User" })
User.hasMany(Address, { foreignKey: "user_id", as: "Addresses" })

Book.hasMany(OrderItem, { foreignKey: "book_id", as: "OrderItems" })
OrderItem.belongsTo(Book, { foreignKey: "book_id", as: "books" })

User.hasMany(Order, { foreignKey: "user_id", as: "Orders" })
Order.belongsTo(User, { foreignKey: "user_id", as: "User" })

export { db, Book, Category, BookCategory, Wishlist, Event, OrderItem, User, Address, Order }