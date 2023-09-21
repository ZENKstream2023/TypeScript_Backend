"use strict";
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
// Define la URL de conexión directamente aquí
const MONGODB_URI =
	"mongodb+srv://webseobilbao:4AQ4z4rI0HeSavoB@portafolio.0zpzcb1.mongodb.net/Escritores";
// Conecta a la base de datos MongoDB (reemplaza '<URL_de_tu_base_de_datos>' con tu URL real)
mongoose_1.default.connect(MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
	console.log("Conectado a MongoDB");
});
// Define el esquema de autores
const authorSchema = new mongoose_1.default.Schema({
	name: String,
});
// Define el esquema de libros con una referencia a autores
const bookSchema = new mongoose_1.default.Schema({
	title: String,
	chapters: Number,
	pages: Number,
	authors: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Author" }],
});
// Crea los modelos de Author y Book
const Author = mongoose_1.default.model("Author", authorSchema);
const Book = mongoose_1.default.model("Book", bookSchema);
// Ruta para crear un nuevo autor
app.post("/authors", (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const newAuthor = yield Author.create(req.body);
			res.status(201).json(newAuthor);
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: "Error al crear el autor" });
		}
	}),
);
// Ruta para listar todos los autores
app.get("/authors", (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const authors = yield Author.find();
			res.json(authors);
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: "Error al listar los autores" });
		}
	}),
);
// Ruta para crear un nuevo libro y vincularlo a autores
app.post("/books", (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const newBook = yield Book.create(req.body);
			res.status(201).json(newBook);
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: "Error al crear el libro" });
		}
	}),
);
// Ruta para listar todos los libros
app.get("/books", (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const books = yield Book.find().populate("authors");
			res.json(books);
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: "Error al listar los libros" });
		}
	}),
);
// Ruta para eliminar un autor por ID
app.delete("/authors/:id", (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const authorId = req.params.id;
			const deletedAuthor = yield Author.findByIdAndRemove(authorId);
			if (!deletedAuthor) {
				return res.status(404).json({ mensaje: "Autor no encontrado" });
			}
			res.json({ mensaje: "Autor eliminado exitosamente" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: "Error al eliminar el autor" });
		}
	}),
);
// Ruta para actualizar un autor por ID
app.put("/authors/:id", (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const authorId = req.params.id;
			const updatedAuthor = yield Author.findByIdAndUpdate(authorId, req.body, {
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
	}),
);
// Ruta para consultar un autor por ID
app.get("/authors/:id", (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const authorId = req.params.id;
			const author = yield Author.findById(authorId);
			if (!author) {
				return res.status(404).json({ mensaje: "Autor no encontrado" });
			}
			res.json(author);
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: "Error al consultar el autor" });
		}
	}),
);
// Ruta para eliminar un libro por ID
app.delete("/books/:id", (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const bookId = req.params.id;
			const deletedBook = yield Book.findByIdAndRemove(bookId);
			if (!deletedBook) {
				return res.status(404).json({ mensaje: "Libro no encontrado" });
			}
			res.json({ mensaje: "Libro eliminado exitosamente" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: "Error al eliminar el libro" });
		}
	}),
);
// Ruta para actualizar un libro por ID
app.put("/books/:id", (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const bookId = req.params.id;
			const updatedBook = yield Book.findByIdAndUpdate(bookId, req.body, {
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
	}),
);
// Ruta para consultar un libro por ID
app.get("/books/:id", (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const bookId = req.params.id;
			const book = yield Book.findById(bookId).populate("authors");
			if (!book) {
				return res.status(404).json({ mensaje: "Libro no encontrado" });
			}
			res.json(book);
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: "Error al consultar el libro" });
		}
	}),
);
// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
	console.log(`Servidor escuchando en el puerto ${port}`);
});
