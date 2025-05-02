const db = require('../config/db');

exports.listarPeliculas = async (req, res) => {
    try {
        const [peliculas] = await db.query('SELECT * FROM Pelicula ORDER BY ID_Pelicula');
        res.render('admin/peliculas', { peliculas });
    } catch (error) {
        console.error('Error al listar películas:', error);
        res.status(500).send('Error al obtener las películas desde la base de datos');
    }
};
