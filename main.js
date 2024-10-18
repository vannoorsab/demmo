const { app, BrowserWindow } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function createDatabase() {
  const db = new sqlite3.Database('students.db', (err) => {
    if (err) console.error('Error opening database:', err);
    else {
      db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        batch INTEGER,
        academic REAL,
        coreCourses REAL,
        hackathons INTEGER,
        papers INTEGER,
        contributions REAL,
        score REAL
      )`);
    }
  });
  return db;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
  createDatabase(); // Initialize the database
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
