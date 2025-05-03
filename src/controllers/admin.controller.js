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

exports.formNuevaPelicula = (req, res) => {
    res.render('admin/nuevaPelicula');
}

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

        res.render('admin/editarPelicula', { pelicula: pelicula[0] });
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
        res.status(500).send('Error al eliminar la película de la base de datos');
    }
}

exports.listarEmpleados = async (req, res) => {
    try {
        const [empleados] = await db.query('SELECT * FROM Empleados');
        res.render('admin/empleados', { empleados });
    } catch (error) {
        console.error('Error al listar películas:', error);
        res.status(500).send('Error al obtener los empleados desde la base de datos');
    }
}

exports.formNuevoEmpleado = (req, res) => {
    res.render('admin/nuevoEmpleado');
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

        res.render('admin/editarEmpleado', { empleado: empleado[0] });
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
        res.status(500).send('Error al eliminar el empleado de la base de datos');
    }
}