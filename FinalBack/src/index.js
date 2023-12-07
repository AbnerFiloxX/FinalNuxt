import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { initializeApp } from 'firebase/app';
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    setDoc,
    updateDoc,
} from 'firebase/firestore';

// Credenciales de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBZxlfGSZ_h74TUb4oNgZJkmWW9D1cXz6U",
    authDomain: "jha-proyecto.firebaseapp.com",
    projectId: "jha-proyecto",
    storageBucket: "jha-proyecto.appspot.com",
    messagingSenderId: "311653058339",
    appId: "1:311653058339:web:313ccecf2798a5d94eae96"
};

//inicializar firebase
const firebase = initializeApp(firebaseConfig)
const db = getFirestore(firebase)

//inicializar el server
const app = express()

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 'alert': 'No token provided' });
    }

    jwt.verify(token, 'secreto', (err, decoded) => {
        if (err) {
            return res.status(403).json({ 'alert': 'Failed to authenticate token' });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

// Rutas de trabajo

// Ruta para registrar un nuevo doctor
app.post('/new-doctor', async (req, res) => {
    const { nombre, usuario, password } = req.body;

    if (!nombre || !usuario || !password) {
        return res.status(400).json({ 'alert': 'Falta información requerida' });
    }

    try {
        const doctores = collection(db, 'doctores');
        const doctor = await getDoc(doc(doctores, usuario));

        if (doctor.exists()) {
            return res.status(409).json({ 'alert': 'El doctor ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            nombre,
            usuario,
            password: hashedPassword,
        };

        await setDoc(doc(doctores, usuario), data);
        res.json({ 'alert': 'Registro exitoso' });
    } catch (error) {
        res.status(500).json({ 'alert': 'Error al registrar doctor', error });
    }
});

// Ruta para autenticar el inicio de sesión del doctor
app.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    try {
        const doctores = collection(db, 'doctores');
        const doctor = await getDoc(doc(doctores, usuario));

        if (!doctor.exists()) {
            return res.status(404).json({ 'alert': 'El doctor no está registrado' });
        }

        const doctorData = doctor.data();
        const validPassword = await bcrypt.compare(password, doctorData.password);

        if (!validPassword) {
            return res.status(401).json({ 'alert': 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ usuario }, 'secreto');
        res.json({ 'alert': 'Inicio de sesión exitoso', 'token': token });
    } catch (error) {
        res.status(500).json({ 'alert': 'Error al iniciar sesión', error });
    }
});

// Ruta para obtener el nombre del doctor
app.get('/nombre-doctor', verifyToken, async (req, res) => {
    const { usuario } = req;

    try {
        const doctores = collection(db, 'doctores');
        const doctor = await getDoc(doc(doctores, usuario));

        if (!doctor.exists()) {
            return res.status(404).json({ 'alert': 'El doctor no está registrado' });
        }

        const doctorData = doctor.data();
        res.json({ 'alert': 'success', 'nombre': doctorData.nombre });
    } catch (error) {
        res.status(500).json({ 'alert': 'Error al obtener el nombre del doctor', error });
    }
});

// Ruta para registrar un nuevo paciente
app.post('/new-patient', async (req, res) => {
    const { nombre, apaterno, amaterno, email, telefono, tratamiento } = req.body;

    if (!nombre || !apaterno || !email) {
        return res.status(400).json({ 'alert': 'Falta información requerida' });
    }

    try {
        const pacientes = collection(db, 'pacientes');
        const paciente = await getDoc(doc(pacientes, email));

        if (paciente.exists()) {
            return res.status(409).json({ 'alert': 'El paciente ya está registrado' });
        }

        const data = {
            nombre,
            apaterno,
            amaterno,
            email,
            telefono,
            tratamiento,
        };

        await setDoc(doc(pacientes, email), data);
        res.json({ 'alert': 'Registro de paciente exitoso' });
    } catch (error) {
        res.status(500).json({ 'alert': 'Error al registrar paciente', error });
    }
});

// Ruta para obtener todos los pacientes
app.get('/get-pacientes', async (req, res) => {
    try {
        const pacientes = [];
        const data = await collection(db, 'pacientes');
        const docs = await getDocs(data);
        docs.forEach((doc) => {
            pacientes.push(doc.data());
        });
        console.log('@@@ pacientes =>', pacientes);
        res.json({
            'alert': 'success',
            'usuarios': pacientes // Devolver el array 'pacientes' como 'usuarios'
        });
    } catch (error) {
        console.log('@@@ error =>', error);
        res.json({
            'alert': 'error getting data',
            error
        });
    }
});

// Ruta para obtener doctores
app.get('/get-doctores', async (req, res) => {
    try {
        const doctoresCollection = collection(db, 'doctores');
        const doctoresSnapshot = await getDocs(doctoresCollection);
        const doctores = [];
        doctoresSnapshot.forEach((doc) => {
            doctores.push(doc.data());
        });
        res.json({ 'doctores': doctores });
    } catch (error) {
        console.error('Error al obtener los doctores:', error);
        res.status(500).json({ 'error': 'Error al obtener los doctores' });
    }
});

// Para pacientes en el form de las citas
app.get('/get-pacientescitas', async (req, res) => {
    try {
        const pacientesCollection = collection(db, 'pacientes');
        const pacientesSnapshot = await getDocs(pacientesCollection);
        const pacientes = [];
        pacientesSnapshot.forEach((doc) => {
            pacientes.push(doc.data());
        });
        res.json({ 'pacientes': pacientes });
    } catch (error) {
        console.error('Error al obtener los pacientes:', error);
        res.status(500).json({ 'error': 'Error al obtener los pacientes' });
    }
});

// Ruta para obtener todas las citas
app.get('/get-citas', async (req, res) => {
    try {
        const citas = [];
        const data = await collection(db, 'citas');
        const docs = await getDocs(data);
        docs.forEach((doc) => {
            citas.push(doc.data());
        });
        console.log('@@@ citas =>', citas);
        res.json({
            'alert': 'success',
            citas
        });
    } catch (error) {
        console.log('@@@ error =>', error);
        res.json({
            'alert': 'error getting data',
            error
        });
    }
});

// Agregar usuarios (pacientes)
app.post('/new-paciente', (req, res) => {
    let { nombre, apaterno, amaterno, email, telefono, fechanacimiento, tratamiento } = req.body

    if (!nombre.length) {
        res.json({
            'alert': 'Falta de agregar nombre'
        })
    } else if (!apaterno.length) {
        res.json({
            'alert': 'Falta agregar a paterno'
        })
    } else if (!email.length) {
        res.json({
            'alert': 'Falta de agregar el usuario'
        })
    }

    const pacientes = collection(db, 'pacientes')

    getDoc(doc(pacientes, email)).then(user => {
        if (user.exists()) {
            res.json({
                'alert': 'El usuario ya existe'
            })
        } else {

            const data = {
                nombre,
                apaterno,
                amaterno,
                email,
                telefono,
                fechanacimiento,
                tratamiento,
            };

            setDoc(doc(pacientes, email), data).then(data => {
                res.json({
                    'alert': 'success',
                    data
                })
            })
        }
    }).catch(error => {
        res.json({
            'alert': 'Error de Conexion'
        })
    })
})

// Eliminar pacientes
app.post('/delete-paciente', (req, res) => {
    const email = req.body.email
    deleteDoc(doc(collection(db, 'pacientes'), email))
        .then(data => {
            res.json({
                'alert': 'success'
            })
        })
        .catch(err => {
            res.json({
                'alert': 'error',
                err
            })
        })
})

// Actualizar paciente
app.post('/edit-paciente', async (req, res) => {
    const { nombre, apaterno, amaterno, telefono, fechanacimiento, tratamiento, email } = req.body
    const edited = await updateDoc(doc(db, 'pacientes', email), {
        nombre,
        apaterno,
        amaterno,
        telefono,
        fechanacimiento,
        tratamiento
    })
    res.json({
        'alert': 'edited',
        edited
    })
})

// Agregar nueva cita
app.post('/new-cita', async (req, res) => {
    try {
        const nuevaCita = req.body;
        const citasCollection = collection(db, 'citas');
        await setDoc(doc(citasCollection), nuevaCita);
        res.json({ 'mensaje': 'Cita agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar la cita:', error);
        res.status(500).json({ 'error': 'Error al agregar la cita' });
    }
});

// Funcion para cambiar de estado
app.post('/change-status', async (req, res) => {
    try {
        const { clave, estatus } = req.body;

        const citasCollection = collection(db, 'citas');
        const citaRef = doc(citasCollection, clave);
        const citaSnapshot = await getDoc(citaRef);

        if (!citaSnapshot.exists()) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        await updateDoc(citaRef, { estatus: estatus });
        return res.status(200).json({ message: 'Estatus de la cita actualizado correctamente' });
    } catch (error) {
        console.error('Error al cambiar el estatus:', error);
        return res.status(500).json({ error: 'Error al cambiar el estatus de la cita' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});