import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import { initializeApp } from 'firebase/app'
import { collection, doc, getDoc, getFirestore, setDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore'

// Credenciales de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBZxlfGSZ_h74TUb4oNgZJkmWW9D1cXz6U",
    authDomain: "jha-proyecto.firebaseapp.com",
    projectId: "jha-proyecto",
    storageBucket: "jha-proyecto.appspot.com",
    messagingSenderId: "311653058339",
    appId: "1:311653058339:web:313ccecf2798a5d94eae96"
  };

// Inicializar firebase
const firebase = initializeApp(firebaseConfig)
const db = getFirestore()

// Inicializar el server
const app = express()

// Cors
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Rutas de trabajo
app.post('/new-user', (req, res) => {
    let { nombre, apaterno, amaterno, email, telefono, password } = req.body

    if (!nombre.length) {
        res.json({
            'alert': 'Falta de agregar Nombre'
        })
    } else if (!apaterno.length){
        res.json({
            'alert': 'Falta de agregar A. Paterno'
        })
    } else if (!email.length){
        res.json({
            'alert': 'Falta de agregar el usuario'
        })
    } else if (!password.length){
        res.json({
            'alert': 'Falta de agregar Password'
        })
    }

    const usuarios = collection(db, 'usuarios')

    getDoc(doc(usuarios, email)).then(user => {
        if (user.exists()) {
            res.json({
                'alert': 'El usuario ya existe'
            })
        } else {
            // Encriptar la contraseña
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    const data = {
                        nombre,
                        apaterno,
                        amaterno,
                        email, 
                        telefono, 
                        password: hash 
                    }
                    setDoc(doc(usuarios, email), data).then(data => {
                        res.json({
                            'alert': 'success',
                            data
                        })
                    })
                })
            })
        }
    }).catch(error => {
        res.json({
            'alert': 'Error de Conexion'
        })
    })
})
app.get('/get-users', async (req, res) => {
    try {
            const usuarios = [];
            const data = await collection(db, 'usuarios')
            const docs = await getDocs(data)
            docs.forEach((doc) => {
                usuarios.push(doc.data())
            })
            console.log('@@@ usuarios => ', usuarios)
        res.json({
            'alert': 'success',
            usuarios
        })
    } catch (error) {
        console.log('@@@ error => ', error)
        res.json({
            'alert': 'error getting data',
            error
        })
    }
})
app.post('/delete-user', (req, res) => {
    const email = req.body.email
    deleteDoc(dic(collection(db, 'usuarios'), email))
    .then(data => {
        res.json({
            'alert': 'success'
        })
    })
    .catch(err => {
        res.json({
            'alert': 'error'
        })
    })
})
app.post('/edit-user', async (req, res) => {
    const {nombre, apaterno, amaterno, telefono, password, email } = req.body
    const edited = await updateDoc(doc(db, 'usuarios', email), {
        nombre, 
        apaterno, 
        amaterno,
        telefono
    })
    res.json({
        'alert': 'edited',
        edited
    })
})  
// Encender el servidor modo escucha
app.listen(5000, () => {
    console.log('Servidor Trabajando: 5000')
})