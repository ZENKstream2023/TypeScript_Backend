import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Define la URL de conexión directamente aquí
const MONGODB_URI =
	"mongodb+srv://webseobilbao:4AQ4z4rI0HeSavoB@portafolio.0zpzcb1.mongodb.net/Escritores";

// Conecta a la base de datos MongoDB (reemplaza '<URL_de_tu_base_de_datos>' con tu URL real)
mongoose.connect(MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
	console.log("Conectado a MongoDB");
});

// Define el esquema de autores
const authorSchema = new mongoose.Schema({
	name: String,
});

// Define el esquema de libros con una referencia a autores
const bookSchema = new mongoose.Schema({
	title: String,
	chapters: Number,
	pages: Number,
	authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
});

// Crea los modelos de Author y Book
const Author = mongoose.model("Author", authorSchema);
const Book = mongoose.model("Book", bookSchema);

// Ruta para crear un nuevo autor
app.post("/authors", async (req: Request, res: Response) => {
	try {
		const newAuthor = await Author.create(req.body);
		res.status(201).json(newAuthor);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al crear el autor" });
	}
});

// Ruta para listar todos los autores
app.get("/authors", async (req: Request, res: Response) => {
	try {
		const authors = await Author.find();
		res.json(authors);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al listar los autores" });
	}
});

// Ruta para crear un nuevo libro y vincularlo a autores
app.post("/books", async (req: Request, res: Response) => {
	try {
		const newBook = await Book.create(req.body);
		res.status(201).json(newBook);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al crear el libro" });
	}
});

// Ruta para listar todos los libros
app.get("/books", async (req: Request, res: Response) => {
	try {
		const books = await Book.find().populate("authors");
		res.json(books);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al listar los libros" });
	}
});
// Ruta para eliminar un autor por ID
app.delete("/authors/:id", async (req: Request, res: Response) => {
	try {
		const authorId = req.params.id;
		const deletedAuthor = await Author.findByIdAndRemove(authorId);

		if (!deletedAuthor) {
			return res.status(404).json({ mensaje: "Autor no encontrado" });
		}

		res.json({ mensaje: "Autor eliminado exitosamente" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al eliminar el autor" });
	}
});

// Ruta para actualizar un autor por ID
app.put("/authors/:id", async (req: Request, res: Response) => {
	try {
		const authorId = req.params.id;
		const updatedAuthor = await Author.findByIdAndUpdate(authorId, req.body, {
			new: true, // Devuelve el autor actualizado
		});

		if (!updatedAuthor) {
			return res.status(404).json({ mensaje: "Autor no encontrado" });
		}

		res.json(updatedAuthor);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al actualizar el autor" });
	}
});

// Ruta para consultar un autor por ID
app.get("/authors/:id", async (req: Request, res: Response) => {
	try {
		const authorId = req.params.id;
		const author = await Author.findById(authorId);

		if (!author) {
			return res.status(404).json({ mensaje: "Autor no encontrado" });
		}

		res.json(author);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al consultar el autor" });
	}
});

// Ruta para eliminar un libro por ID
app.delete("/books/:id", async (req: Request, res: Response) => {
	try {
		const bookId = req.params.id;
		const deletedBook = await Book.findByIdAndRemove(bookId);

		if (!deletedBook) {
			return res.status(404).json({ mensaje: "Libro no encontrado" });
		}

		res.json({ mensaje: "Libro eliminado exitosamente" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al eliminar el libro" });
	}
});

// Ruta para actualizar un libro por ID
app.put("/books/:id", async (req: Request, res: Response) => {
	try {
		const bookId = req.params.id;
		const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
			new: true, // Devuelve el libro actualizado
		});

		if (!updatedBook) {
			return res.status(404).json({ mensaje: "Libro no encontrado" });
		}

		res.json(updatedBook);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al actualizar el libro" });
	}
});

// Ruta para consultar un libro por ID
app.get("/books/:id", async (req: Request, res: Response) => {
	try {
		const bookId = req.params.id;
		const book = await Book.findById(bookId).populate("authors");

		if (!book) {
			return res.status(404).json({ mensaje: "Libro no encontrado" });
		}

		res.json(book);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al consultar el libro" });
	}
});
// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
	console.log(`Servidor escuchando en el puerto ${port}`);
});
