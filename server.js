const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const FILE_UTENTI = path.join(__dirname, 'utenti.json');

// Inizializza il file degli utenti se non esiste
if (!fs.existsSync(FILE_UTENTI)) {
    fs.writeFileSync(FILE_UTENTI, JSON.stringify([]));
}

// Endpoint per registrarsi
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Inserisci username e password!" });
    }

    const datiRaw = fs.readFileSync(FILE_UTENTI);
    const utenti = JSON.parse(datiRaw);

    // Controlla se l'utente esiste già
    const utenteEsistente = utenti.find(u => u.username === username);
    if (utenteEsistente) {
        return res.status(400).json({ error: "Username già esistente!" });
    }

    // Aggiungi il nuovo utente
    utenti.push({ username, password, progressi: {} });
    fs.writeFileSync(FILE_UTENTI, JSON.stringify(utenti, null, 2));

    res.json({ success: true, message: "Account creato con successo!" });
}); // <-- Questa era la riga che mancava!

// Avvia il server
app.listen(PORT, () => {
    console.log(`🚀 Server temporaneo attivo su http://localhost:${PORT}`);
});