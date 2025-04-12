const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware per servire file statici
app.use(express.static(path.join(__dirname, 'sito')));

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
