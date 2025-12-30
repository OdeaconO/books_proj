import dotenv from "dotenv";
dotenv.config();
import { db } from "./db.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { authorizeBookOwner } from "./middleware/authorizeBookOwner.js";

const app = express(); 

// if there is a authentication problem
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '@Admin123';
// or simply import mysql2

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res)=>{
    res.json("hello this is the backend");
})

app.get("/books", (req, res) => {
  const search = req.query.q || "";
  const sort = req.query.sort || "az";
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  // get total count
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM books
    WHERE title LIKE ?
  `;

  // get paginated books
  const dataQuery = `
    SELECT * FROM books
    WHERE title LIKE ?
    ORDER BY title ${sort === "az" ? "ASC" : "DESC"}
    LIMIT ? OFFSET ?
  `;

  db.query(countQuery, [`%${search}%`], (err, countResult) => {
    if (err) return res.status(500).json(err);

    const totalBooks = countResult[0].total;
    const totalPages = Math.ceil(totalBooks / limit);

    db.query(
      dataQuery,
      [`%${search}%`, limit, offset],
      (err, data) => {
        if (err) return res.status(500).json(err);

        return res.json({
          books: data,
          pagination: {
            currentPage: page,
            totalPages,
            totalBooks,
          },
        });
      }
    );
  });
});



app.get("/my-books", verifyToken, (req, res) => {
  const q = "SELECT * FROM books WHERE user_id = ?";

  db.query(q, [req.user.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

app.post("/books", verifyToken, (req,res)=>{
    const q = `INSERT INTO books (\`title\`, \`desc\`, \`price\`, \`cover\`, \`user_id\`, \`username\`) VALUES (?)`;
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
        req.user.id,
        req.user.username
    ];

    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
            return res.json("book has been created successfully");
    })
})

app.delete("/books/:id", verifyToken, authorizeBookOwner, (req, res)=>{
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE id = ?"; 

    db.query(q,[bookId], (err, data)=>{
        if(err) return res.json(err) 
            return res.json("book has been deleted successfully");
    })
})

app.put("/books/:id", verifyToken, authorizeBookOwner,(req, res)=>{
    const bookId = req.params.id;
    const q = "UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?"; 

    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover
    ];

    db.query(q,[...values, bookId], (err, data)=>{
        if(err) return res.json(err) 
            return res.json("book has been updated successfully");
    })
})

app.listen(process.env.PORT, () => {
  console.log("Backend running on port", process.env.PORT);
});