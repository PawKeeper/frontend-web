const express = require('express');
const path = require('path');

const app = express();

const port = 80;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/:id', (req, res) => {
  const { id } = req.params; 
  console.log('ID recibido:', id);

  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
