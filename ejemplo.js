const nano = require('nano')('http://localhost:5984'); // Reemplaza con la URL de tu servidor CouchDB
const dbName = 'mi_base_de_datos';
const db = nano.use(dbName);
// Crear un nuevo documento
const nuevoDocumento = { nombre: 'Ejemplo' };
db.insert(nuevoDocumento, (err, body) => {
  if (!err) {
    console.log(body);
  }
});

// Leer un documento por su ID
db.get('id_del_documento', (err, body) => {
  if (!err) {
    console.log(body);
  }
});

// Actualizar un documento
db.get('id_del_documento', (err, body) => {
  if (!err) {
    body.nombre = 'Nuevo nombre';
    db.insert(body, (err, body) => {
      if (!err) {
        console.log(body);
      }
    });
  }
});

// Borrar un documento
db.get('id_del_documento', (err, body) => {
  if (!err) {
    db.destroy(body._id, body._rev, (err, body) => {
      if (!err) {
        console.log('Documento eliminado');
      }
    });
  }
});
