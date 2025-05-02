const db = require('../config/db');

exports.verCartelera = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT 
        Pelicula.ID_Pelicula, Pelicula.Nombre, Pelicula.Resumen,
        Funcion.ID_Funcion, Funcion.Horario,
        Sala.Numero_Sala
      FROM Pelicula
      JOIN Funcion ON Funcion.Pelicula_ID_Pelicula = Pelicula.ID_Pelicula
      JOIN Sala ON Funcion.Sala_ID_Sala = Sala.ID_Sala
      ORDER BY Funcion.Horario
    `);

        // Agrupar funciones por película
        const cartelera = {};
        rows.forEach(row => {
            const id = row.ID_Pelicula;
            if (!cartelera[id]) {
                cartelera[id] = {
                    nombre: row.Nombre,
                    resumen: row.Resumen,
                    funciones: []
                };
            }
            cartelera[id].funciones.push({
                id_funcion: row.ID_Funcion,
                fecha: row.Fecha,
                hora: row.Hora,
                sala: row.SalaNombre
            });
        });

        res.render('client/index', { cartelera });
    } catch (err) {
        console.error('Error al cargar cartelera:', err);
        res.status(500).send('Error al mostrar cartelera');
    }
};
