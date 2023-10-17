const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');

app.use(express.static('public'));


mongoose.connect('mongodb://0.0.0.0:27017/canciones', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error(error);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('MongoDB connected!');
});

// Configurar el motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

app.engine('ejs', require('ejs').renderFile);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


const cancionSchema = new mongoose.Schema({
    nombre: String,
    cantante: String,
    album: String,
    fecha: Date,
    cancion: Buffer, // Puedes usar el tipo Buffer para almacenar datos binarios, como archivos MP3
    imagen: String // Puedes usar el tipo String para almacenar rutas de imagen o enlaces a imágenes
  });

const Cancion = mongoose.model('Cancion', cancionSchema)

// Ruta para mostrar el formulario
app.get('/agregar', (req, res) => {
    res.render('agregar.ejs');
});

// Ruta para manejar el envío del formulario
app.post('/agregar', upload.fields([{ name: 'cancion', maxCount: 1 }, { name: 'imagen', maxCount: 1 }]), (req, res) => {
    const { nombre, cantante, album, fecha } = req.body;
    const cancion = req.files['cancion'][0];
    const imagen = req.files['imagen'][0];

    

    const nuevaCancion = new Cancion({
        nombre,
        cantante,
        album,
        fecha,
        cancion: 'uploads/' + cancion.filename, // Guarda la ruta del archivo MP3
        imagen: imagen.filename // Guarda el nombre del archivo de imagen
    });

    nuevaCancion.save().then(() => {
        console.log('New song created');
        res.redirect('/')
    }).catch((error) => {
        console.error('Error creando cancion:',error)
    })

    
});
// Ruta para mostrar la lista de canciones
app.get('/', async (req, res) => {
  try {
      const canciones = await Cancion.find({});
      res.render('index.ejs', { canciones });
  } catch (error) {
      console.error(error);
      // Manejar el error de acuerdo a tus necesidades
      res.status(500).send('Error al obtener las canciones.');
  }
});



// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Aplicación web dinámica ejecutándose en el puerto 3000');
});
