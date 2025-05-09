const db = require('../config/db');

// Función reutilizable para calcular el horario
const calcularHorario = (fecha, hora) => {
    // Convertir '04/May/2025' a '2025-05-04'
    const convertirFecha = (fecha) => {
        const partes = fecha.split('/');
        const dia = partes[0];
        const mes = {
            Ene: '01', Feb: '02', Mar: '03', Abr: '04', May: '05', Jun: '06',
            Jul: '07', Ago: '08', Sep: '09', Oct: '10', Nov: '11', Dic: '12'
        }[partes[1]];
        const anio = partes[2];
        return `${anio}-${mes}-${dia}`;
    };

    const fechaISO = convertirFecha(fecha); // Convertir la fecha al formato ISO
    const [horaStr, minutosStr] = hora.split(':');
    const horario = `${fechaISO} ${horaStr}:${minutosStr}:00`; // Formato final
    return horario;
};

exports.listarPeliculas = async (req, res) => {
    try {
        const [peliculas] = await db.query('SELECT * FROM Pelicula ORDER BY ID_Pelicula');
        res.render('admin/peliculas/peliculas', { peliculas });
    } catch (error) {
        console.error('Error al listar películas:', error);
        res.status(500).send('Error al obtener las películas desde la base de datos');
    }
};

exports.guardarPelicula = async (req, res) => {
    const { nombre, resumen, año, duracion, idioma, director, costo } = req.body;

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

exports.formEditarPelicula = async (req, res) => {
    const { id } = req.params;

    try {
        const [pelicula] = await db.query('SELECT * FROM Pelicula WHERE ID_Pelicula = ?', [id]);

        if (pelicula.length === 0) {
            return res.status(404).send('Película no encontrada');
        }

        res.render('admin/peliculas/editarPelicula', { pelicula: pelicula[0] });
    } catch (error) {
        console.error('Error al obtener la película:', error);
        res.status(500).send('Error al obtener la película desde la base de datos');
    }
}

exports.actualizarPelicula = async (req, res) => {
    const { id } = req.params;
    const { nombre, resumen, año, duracion, idioma, director, costo } = req.body;

    // Validar los campos requeridos
    if (!nombre || !resumen || !duracion || !idioma || !director || !costo) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    try {
        await db.query('UPDATE Pelicula SET Nombre = ?, Resumen = ?, Año = ?, Duración = ?, Idioma = ?, Director = ?, Costo = ? WHERE ID_Pelicula = ?', [nombre, resumen, año, duracion, idioma, director, costo, id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error al actualizar la película:', error);
        res.status(500).send('Error al actualizar la película en la base de datos');
    }
}

exports.eliminarPelicula = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM Pelicula WHERE ID_Pelicula = ?', [id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error al eliminar la película:', error);
        res.status(500).send('Error al eliminar La pelicula, existen funciones asociadas a esta');
    }
}

exports.listarEmpleados = async (req, res) => {
    try {
        const [empleados] = await db.query('SELECT * FROM Empleados');
        res.render('admin/empleados/empleados', { empleados });
    } catch (error) {
        console.error('Error al listar películas:', error);
        res.status(500).send('Error al obtener los empleados desde la base de datos');
    }
}

exports.guardarEmpleado = async (req, res) => {
    const { Apellido_P, Apellido_M, Nombres, Fecha_Nacimiento, Correo } = req.body

    console.log('Datos del empleado:', req.body);

    if (!Apellido_P || !Apellido_M || !Nombres || !Fecha_Nacimiento || !Correo) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    //validar correo no repetido
    const [correoExistente] = await db.query('SELECT * FROM Empleados WHERE Correo = ?', [Correo]);
    if (correoExistente.length > 0) {
        return res.status(400).send('El correo ya está registrado');
    }

    const [empleados] = await db.query('SELECT COUNT(*) AS count FROM Empleados');
    let count = empleados[0].count + 1;
    let idEmpleado = `EMP${String(count).padStart(3, '0')}`;
    console.log('ID_EMP:', idEmpleado);

    let [empleadoExistente] = await db.query('SELECT * FROM Empleados WHERE ID_EMP = ?', [idEmpleado]);

    while (empleadoExistente.length > 0) {
        count++;
        idEmpleado = `EMP${String(count).padStart(3, '0')}`;
        [empleadoExistente] = await db.query('SELECT * FROM Empleados WHERE ID_EMP = ?', [idEmpleado]);
        console.log(empleadoExistente)
    }

    try {
        await db.query('INSERT INTO Empleados (ID_EMP, Apellido_P, Apellido_M, Nombres, Fecha_Nacimiento, Correo) VALUES (?, ?, ?, ?, ?, ?)', [idEmpleado, Apellido_P, Apellido_M, Nombres, Fecha_Nacimiento, Correo]);
        res.redirect('/admin/empleados');
    } catch (error) {
        console.error('Error al guardar el empleado:', error);
        res.status(500).send('Error al guardar el empleado en la base de datos');
    }
}

exports.formEditarEmpleado = async (req, res) => {
    const { id } = req.params;

    try {
        const [empleado] = await db.query('SELECT * FROM Empleados WHERE ID_EMP = ?', [id]);

        if (empleado.length === 0) {
            return res.status(404).send('Empleado no encontrado');
        }

        res.render('admin/empleados/editarEmpleado', { empleado: empleado[0] });
    } catch (error) {
        console.error('Error al obtener el empleado:', error);
        res.status(500).send('Error al obtener el empleado desde la base de datos');
    }
}

exports.actualizarEmpleado = async (req, res) => {
    const { id } = req.params;
    const { Apellido_P, Apellido_M, Nombres, Fecha_Nacimiento, Correo } = req.body;

    // Validar los campos requeridos
    if (!Apellido_P || !Apellido_M || !Nombres || !Fecha_Nacimiento || !Correo) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    //validar correo no repetido
    const [correoExistente] = await db.query('SELECT * FROM Empleados WHERE Correo = ?', [Correo]);
    if (correoExistente.length > 0) {
        return res.status(400).send('El correo ya está registrado');
    }

    try {
        await db.query('UPDATE Empleados SET Apellido_P = ?, Apellido_M = ?, Nombres = ?, Fecha_Nacimiento = ?, Correo = ? WHERE ID_EMP = ?', [Apellido_P, Apellido_M, Nombres, Fecha_Nacimiento, Correo, id]);
        res.redirect('/admin/empleados');
    } catch (error) {
        console.error('Error al actualizar el empleado:', error);
        res.status(500).send('Error al actualizar el empleado en la base de datos');
    }
}

exports.eliminarEmpleado = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM Empleados WHERE ID_EMP = ?', [id]);
        res.redirect('/admin/empleados');
    } catch (error) {
        console.error('Error al eliminar el empleado:', error);
        res.status(500).send('Error al eliminar el empleado, existen tickets asociadas a este');
    }
}

exports.listarSalas = async (req, res) => {
    try {
        const [salas] = await db.query('SELECT * FROM Sala ORDER BY Numero_Sala');
        res.render('admin/salas/salas', { salas });
    } catch (error) {
        console.error('Error al listar salas:', error);
        res.status(500).send('Error al obtener las salas desde la base de datos');
    }
}

exports.formNuevaSala = (req, res) => {
    res.render('admin/salas/nuevaSala');
}

exports.guardarSala = async (req, res) => {
    const { numero, capacidad, mapa_html } = req.body;

    // Validar los campos requeridos
    if (!numero || !capacidad || !mapa_html) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    try {
        await db.query('INSERT INTO Sala (Numero_Sala, Capacidad, mapa_html) VALUES (?, ?, ?)', [numero, capacidad, mapa_html]);
        res.redirect('/admin/salas/salas');
    } catch (error) {
        console.error('Error al guardar la sala:', error);
        res.status(500).send('Error al guardar la sala en la base de datos');
    }
}

exports.formEditarSala = async (req, res) => {
    const { id } = req.params;

    try {
        const [sala] = await db.query('SELECT * FROM Sala WHERE ID_Sala = ?', [id]);

        if (sala.length === 0) {
            return res.status(404).send('Sala no encontrada');
        }

        res.render('admin/salas/editarSala', { sala: sala[0] });
    } catch (error) {
        console.error('Error al obtener la sala:', error);
        res.status(500).send('Error al obtener la sala desde la base de datos');
    }
}

exports.actualizarSala = async (req, res) => {
    const { id } = req.params;
    const { numero, capacidad, mapa_html } = req.body;

    // Validar los campos requeridos
    if (!numero || !capacidad || !mapa_html) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    try {
        await db.query('UPDATE Sala SET Numero_Sala = ?, Capacidad = ?, mapa_html = ? WHERE ID_Sala = ?', [numero, capacidad, mapa_html, id]);
        res.redirect('/admin/salas');
    } catch (error) {
        console.error('Error al actualizar la sala:', error);
        res.status(500).send('Error al actualizar la sala en la base de datos');
    }
}

exports.eliminarSala = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM Sala WHERE ID_Sala = ?', [id]);
        res.redirect('/admin/salas');
    } catch (error) {
        console.error('Error al eliminar la sala:', error);
        res.status(500).send('Error al eliminar la sala, existen funciones asociadas a esta');
    }
}

exports.listarFunciones = async (req, res) => {
    try {
        const [funciones] = await db.query(`
            SELECT 
                ID_Funcion,
                Nombre, 
                Duración, 
                Numero_Sala, 
                Horario 
            FROM Funcion 
            JOIN Pelicula ON Funcion.Pelicula_ID_Pelicula = Pelicula.ID_Pelicula 
            JOIN Sala ON Funcion.Sala_ID_Sala = Sala.ID_Sala
            WHERE DATE(Horario) = CURDATE() -- Solo funciones de la fecha actual
            ORDER BY Funcion.Horario
        `);
        res.render('admin/funciones/funciones', { funciones });
    } catch (error) {
        console.error('Error al listar funciones:', error);
        res.status(500).send('Error al obtener las funciones desde la base de datos');
    }
}

exports.formNuevaFuncion = async (req, res) => {
    try {
        const [peliculas] = await db.query('SELECT ID_Pelicula, Nombre, Duración, Costo FROM Pelicula');
        const [salas] = await db.query('SELECT ID_Sala, Numero_Sala FROM Sala');
        res.render('admin/funciones/nuevaFuncion', { peliculas, salas });
    } catch (error) {
        console.error('Error al obtener películas o salas:', error);
        res.status(500).send('Error al obtener películas o salas desde la base de datos');
    }
}

exports.guardarFuncion = async (req, res) => {
    const { pelicula, sala, fecha, hora } = req.body;

    console.log(req.body);

    // Validar los campos requeridos
    if (!pelicula || !sala || !hora || !fecha) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    const horario = calcularHorario(fecha, hora); // Calcular el horario
    console.log('Horario:', horario);

    try {
        await db.query('INSERT INTO Funcion (Pelicula_ID_Pelicula, Sala_ID_Sala, Horario) VALUES (?, ?, ?)', [pelicula, sala, horario]);
        res.redirect('/admin/funciones');
    } catch (error) {
        console.error('Error al guardar la función:', error);
        res.status(500).send('Error al guardar la función en la base de datos');
    }
}

exports.listarFuncionesPorFecha = async (req, res) => {
    const { fecha } = req.query;

    try {
        const [funciones] = await db.query(`
            SELECT 
                ID_Funcion,
                Nombre, 
                Duración, 
                Numero_Sala, 
                Horario 
            FROM Funcion 
            JOIN Pelicula ON Funcion.Pelicula_ID_Pelicula = Pelicula.ID_Pelicula 
            JOIN Sala ON Funcion.Sala_ID_Sala = Sala.ID_Sala
            WHERE DATE(Horario) = ? -- Funciones de la fecha seleccionada
            ORDER BY Funcion.Horario
        `, [fecha]);

        res.status(200).json(funciones);
    } catch (error) {
        console.error('Error al listar funciones:', error);
        res.status(500).send('Error al obtener las funciones desde la base de datos');
    }
}

exports.formEditarFuncion = async (req, res) => {
    const { id } = req.params;

    try {
        const [funcion] = await db.query('SELECT * FROM Funcion WHERE ID_Funcion = ?', [id]);

        if (funcion.length === 0) {
            return res.status(404).send('Función no encontrada');
        }

        const [peliculas] = await db.query('SELECT ID_Pelicula, Nombre, Duración, Costo FROM Pelicula');
        const [salas] = await db.query('SELECT ID_Sala, Numero_Sala FROM Sala');

        res.render('admin/funciones/editarFuncion', { funcion: funcion[0], peliculas, salas });
    } catch (error) {
        console.error('Error al obtener la función:', error);
        res.status(500).send('Error al obtener la función desde la base de datos');
    }
}

exports.actualizarFuncion = async (req, res) => {
    const { id } = req.params;
    const { pelicula, sala, fecha, hora } = req.body;

    // Validar los campos requeridos
    if (!pelicula || !sala || !hora || !fecha) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    const horario = calcularHorario(fecha, hora); // Calcular el horario
    console.log('Horario:', horario);

    try {
        await db.query('UPDATE Funcion SET Pelicula_ID_Pelicula = ?, Sala_ID_Sala = ?, Horario = ? WHERE ID_Funcion = ?', [pelicula, sala, horario, id]);
        res.redirect('/admin/funciones');
    } catch (error) {
        console.error('Error al actualizar la función:', error);
        res.status(500).send('Error al actualizar la función en la base de datos');
    }
}

exports.eliminarFuncion = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM Funcion WHERE ID_Funcion = ?', [id]);
        res.status(200).send('Función eliminada correctamente');
    } catch (error) {
        console.error('Error al eliminar la función:', error);
        res.status(500).send('Error al eliminar la función, existen tickets asociadas a esta');
    }
}