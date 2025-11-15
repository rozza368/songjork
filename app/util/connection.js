const mariadb = require('mariadb');

export const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  connectionLimit: 5
});

// run this once on starting server
export async function dbSetup() {
  let conn;
  try {
    conn = await pool.getConnection();

    const sqlCreateUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password_hash VARCHAR(97),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    const sqlCreateSongsTable = `
      CREATE TABLE IF NOT EXISTS songs (
        song_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100),
        artist VARCHAR(100),
        release_date DATETIME,
        duration INT NOT NULL,
        bpm INT,
        youtube_id VARCHAR(11)
      );
    `;

    const sqlCreateJorksTable = `
      CREATE TABLE IF NOT EXISTS jorks (
        jork_id INT AUTO_INCREMENT PRIMARY KEY,
        song_id INT,
        user_id INT,
        start_time INT,
        end_time INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (song_id)
          REFERENCES songs(song_id),
        FOREIGN KEY (user_id)
          REFERENCES users(user_id)
          ON DELETE CASCADE
      );
    `;

    // Execute each table creation separately
    await conn.query(sqlCreateUsersTable);
    await conn.query(sqlCreateSongsTable);
    await conn.query(sqlCreateJorksTable);
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
}