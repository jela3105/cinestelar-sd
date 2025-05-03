const db = require('../config/db');

exports.listarPeliculas = async (req, res) => {
    try {
        const [peliculas] = await db.query('SELECT * FROM Pelicula ORDER BY ID_Pelicula');
        console.log('Películas obtenidas:', peliculas);
        res.render('admin/peliculas', { peliculas });
    } catch (error) {
        console.error('Error al listar películas:', error);
        res.status(500).send('Error al obtener las películas desde la base de datos');
    }
};

exports.formNuevaPelicula = (req, res) => {
    res.render('admin/nuevaPelicula');
}

exports.guardarPelicula = async (req, res) => {
    const { nombre, resumen, año, duracion, idioma, director, costo } = req.body;

    console.log('Datos recibidos:', req.body);

    // Validar los campos requeridos
    if (!nombre || !resumen || !duracion || !idioma || !director || !costo) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    try {
        await db.query('INSERT INTO Pelicula (Nombre, Resumen, Año, Duración, Idioma, Director, Costo) VALUES (?, ?, ?, ?, ?, ?, ?)', [nombre, resumen, año, duracion, idioma, director, costo]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error al guardar la película:', error);
        res.status(500).send('Error al guardar la película en la base de datos');
    }
}