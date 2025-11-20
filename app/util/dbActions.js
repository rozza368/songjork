import { pool } from './connection';
const argon2 = require('argon2');

async function runQuery(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    let result;
    if (params) {
      result = await conn.query(sql, params);
    }
    else {
      result = await conn.query(sql);
    }
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

// USER ACTIONS

export async function getUserInfo(userId) {
  if (userId) {
    return runQuery("SELECT * FROM users WHERE user_id = ?", [userId]);
  }
  else {
    return runQuery("SELECT * FROM users");
  }
}

export async function updateUserInfo(userId, newInfo) {
  // TODO
}

export async function deleteUser(userId) {
  return runQuery("DELETE FROM users WHERE user_id = ?", [userId]);
}

export async function addUser(username, plaintextPassword) {
  const hashedPassword = await argon2.hash(plaintextPassword);
  return runQuery(
    "INSERT INTO users (username, password_hash) VALUE (?, ?)",
    [username, hashedPassword]);
}

export async function isValidCredentials(username, password) {
  const userInfo = runQuery(
    "SELECT (username, password_hash) FROM users WHERE username = ?", [username]
  );
  if (!userInfo) {
    return false;
  }
  const hashedPassword = userInfo[0]["password_hash"];
  try {
    const isValid = await argon2.verify(hashedPassword, password);
    return isValid;
  } catch (err) {
    console.error("argon2 validation failed:", err);
  }
  return false;
}

// JORK ACTIONS

export async function getJorkInfo(jorkId) {
  if (jorkId) {
    return runQuery("SELECT * FROM jorks WHERE jork_id = ?", [jorkId]);
  }
  else {
    return runQuery("SELECT * FROM jorks");
  }
}

export async function updateJorkInfo(jorkId, newInfo) {
  const params = Object.entries(newInfo).flat();
  const numParams = Object.keys(newInfo).length;
  if (params.length === 0) return;

  // dodgy but it works
  const placeholders = [];
  for (let i = 0; i < numParams; i++) {
    placeholders.push("? = ?");
  }
  const placeholderString = placeholders.join(", ");

  // add ID onto the end
  params.push(jorkId);
  return runQuery(`UPDATE jorks SET ${placeholderString} WHERE jork_id = ?`, params);
}

export async function deleteJork(jorkId) {
  return runQuery("DELETE FROM jorks WHERE jork_id = ?", [jorkId]);
}

export async function addJork(jorkInfo) {
  const { songId, userId, startTime, endTime } = jorkInfo;

  // all parameters must be present
  if (!songId || !userId || !startTime || !endTime)
    return null;

  return runQuery(
    "INSERT INTO jorks (song_id, user_id, start_time, end_time) VALUES (?, ?, ?, ?)",
    [songId, userId, startTime, endTime]
  );
}

// SONG ACTIONS

export async function getSongInfo(songId) {
  if (songId) {
    return runQuery("SELECT * FROM songs WHERE song_id = ?", [songId]);
  }
  else {
    return runQuery("SELECT * FROM songs");
  }
}

export async function updateSongInfo(songId, newInfo) {
  // TODO
  return runQuery("UPDATE songs SET ? WHERE song_id = ?", [songId]);
}

export async function deleteSong(songId) {
  return runQuery("DELETE FROM songs WHERE song_id = ?", [songId]);
}

export async function addSong(songInfo) {
  const { title, artist, releaseDate, duration, bpm } = songInfo;

  // all parameters must be present
  if (!title || !artist || !duration)
    return null;

  const params = {
    "title": title,
    "artist": artist,
    "duration": duration,
    "release_date": releaseDate,
    "bpm": bpm,
  };

  const fields = Object.keys(params);
  const values = Object.values(params);

  return runQuery(
    `INSERT INTO songs (${fields}) VALUES (?, ?, ?, ?, ?)`,
    values
  );
}