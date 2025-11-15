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

export async function updateUserInfo(userId, newInfo) {}

export async function deleteUser(userId) {
  return runQuery("DELETE FROM users WHERE user_id = ?", [userId]);
}

export async function addUser(username, password) {
  const hashedPassword = await argon2.hash(password);
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

export async function getJorkInfo(jorkId) {}

export async function updateJorkInfo(jorkId, newInfo) {}

export async function deleteJork(jorkId) {}

export async function addJork(jorkInfo) {}

// SONG ACTIONS

export async function getSongInfo(songId) {}

export async function updateSongInfo(songId, newInfo) {}

export async function deleteSong(songId) {}

export async function addSong(songInfo) {}