import { db } from "../db.js";

export const authorizeBookOwner = (req, res, next) => {
  const bookId = req.params.id;

  const q = "SELECT user_id FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Book not found");

    const bookOwnerId = data[0].user_id;

    // Admin can do anything
    if (req.user.role === "admin") {
      return next();
    }

    // Owner can modify their own book
    if (bookOwnerId === req.user.id) {
      return next();
    }

    return res.status(403).json("You are not allowed to modify this book");
  });
};
