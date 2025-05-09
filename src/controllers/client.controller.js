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
      WHERE DATE(Funcion.Horario) = CURDATE()
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
                sala: row.Numero_Sala,
                horario: row.Horario
            });
        });

        res.render('client/index', { cartelera });
    } catch (err) {
        console.error('Error al cargar cartelera:', err);
        res.status(500).send('Error al mostrar cartelera');
    }
};

exports.comprar = async (req, res) => {
    const { funcionId } = req.params;

    try {
        // Verificar si la función existe
        const [funcion] = await db.query(`
            SELECT 
                Funcion.ID_Funcion, 
                Funcion.Horario,
                Pelicula.Nombre, 
                Pelicula.Costo,
                Sala.Numero_Sala, 
                Sala.Capacidad,
                Sala.mapa_html
            FROM Funcion
            JOIN Pelicula ON Funcion.Pelicula_ID_Pelicula = Pelicula.ID_Pelicula
            JOIN Sala ON Funcion.Sala_ID_Sala = Sala.ID_Sala
            WHERE Funcion.ID_Funcion = ?
            `,
            [funcionId]
        );

        if (funcion.length === 0) {
            return res.status(404).send('Función no encontrada');
        }

        const [asientos] = await db.query(`
            SELECT CONCAT(Fila, Numero) AS Asiento
	        FROM Detalle_Ticket
	        JOIN Ticket ON Detalle_Ticket.Ticket_ID_Ticket = Ticket.ID_Ticket
	        WHERE Funcion_ID_Funcion = ?;`,
            [funcionId]);

        // Convertir los asientos reservados a un formato más manejable
        const asientosReservados = asientos.map(asiento => asiento.Asiento);

        // Renderizar la vista de compra con los detalles de la función
        res.render('client/comprar', { funcion: funcion[0], asientosReservados });
    }
    catch (err) {
        console.error('Error al cargar función:', err);
        res.status(500).send('Error al cargar función');
    }
}

exports.reservar = async (req, res) => {
    const { funcionId, asientos } = req.body;

    setTimeout(() => {
    }, process.env.BUY_DELAY);

    let connection; // Variable para almacenar la conexión

    try {
        // Obtener una conexión del pool
        connection = await db.getConnection();

        // Iniciar la transacción
        await connection.beginTransaction();

        // Verificar si la función existe
        const [funcion] = await connection.query(`
            SELECT 
                Funcion.ID_Funcion, 
                Sala.Capacidad
            FROM Funcion
            JOIN Sala ON Funcion.Sala_ID_Sala = Sala.ID_Sala
            WHERE Funcion.ID_Funcion = ?
            `,
            [funcionId]
        );

        if (funcion.length === 0) {
            return res.status(404).send('Función no encontrada');
        }

        // Convertir los asientos en tuplas de fila y número
        const asientosProcesados = asientos.map(asiento => {
            const fila = asiento.slice(0, 1); // Extraer la letra (fila)
            const numero = asiento.slice(1); // Extraer el número
            return { fila, numero };
        });

        // Verificar si los asientos están disponibles
        for (const asiento of asientosProcesados) {
            const { fila, numero } = asiento;
            console.log(fila, numero);
            const [rows] = await connection.query(`
                SELECT COUNT(*) AS count
                FROM Detalle_Ticket
                JOIN Ticket ON Detalle_Ticket.Ticket_ID_Ticket = Ticket.ID_Ticket
                WHERE Funcion_ID_Funcion = ? AND Fila = ? AND Numero = ?`,
                [funcionId, fila, numero]
            );

            if (rows[0].count > 0) {
                throw new Error(`El asiento ${fila}${numero} ya está reservado`);
            }
        }

        // Insertar el ticket y los detalles de los asientos
        const [result] = await connection.query(`INSERT INTO Ticket (Funcion_ID_Funcion) VALUES (?)`, [funcionId]);
        const ticketId = result.insertId;
        console.log(ticketId);

        for (const asiento of asientosProcesados) {
            const { fila, numero } = asiento;
            await connection.query(`INSERT INTO Detalle_Ticket (Ticket_ID_Ticket, Fila, Numero) VALUES (?, ?, ?)`, [ticketId, fila, numero]);
        }

        // Confirmar la transacción
        await connection.commit();
        res.status(200).json({ message: 'Asientos reservados con éxito, ticket numero' + ticketId });
    } catch (err) {
        // Revertir la transacción en caso de error
        if (connection) await connection.rollback();
        console.error('Error al reservar asientos:', err);
        res.status(500).json({ message: err.message });
    } finally {
        // Liberar la conexión
        if (connection) connection.release();
    }
};
