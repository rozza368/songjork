import { pool } from './connection';
const argon2 = require('argon2');

function createSuccessMessage(data) {
  return {status: "success", ...data};
}

function createErrorMessage(err) {
  return {status: "error", message: err};
}

/*

Assumptions:
- PUT is used to replace data, so we can assume all fields will be provided

*/

// USER ACTIONS

function isAcceptableUsername(username) {
  // TODO: validate name
  return true;
}

export async function getUserInfo(userId) {
  let sql;
  let param;
  if (userId) {
    sql = "SELECT * FROM users WHERE user_id = ?";
    param = [userId];
  }
  else {
    sql = "SELECT * FROM users";
    param = [];
  }

  try {
    const rows = await pool.query(sql, param);
    return createSuccessMessage({
      count: rows.length,
      users: rows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}

export async function updateUserName(userId, newName) {
  if (!isAcceptableUsername(newName)) {
    return createErrorMessage("Invalid username");
  }

  try {
    const res = await pool.query(
      "UPDATE users SET username = ? WHERE user_id = ?", [newName, userId]
    );
    return createSuccessMessage({
      affected_rows: res.affectedRows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}

export async function updateUserPassword(userId, plaintextPassword) {
  const hashedPassword = await argon2.hash(plaintextPassword);
  try {
    const res = await pool.query(
      "UPDATE users SET password_hash = ? WHERE user_id = ?", [hashedPassword, userId]
    );
    return createSuccessMessage({
      affected_rows: res.affectedRows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}

export async function deleteUser(userId) {
  try {
    const res = await pool.query("DELETE FROM users WHERE user_id = ?", [userId]);
    // TODO: handle user ID not existing
    return createSuccessMessage({
      affected_rows: res.affectedRows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}

export async function addUser(username, plaintextPassword) {
  if (!isAcceptableUsername(username)) {
    return createErrorMessage("Invalid username");
  }

  const hashedPassword = await argon2.hash(plaintextPassword);
  try {
    const res = await pool.query(
      "INSERT INTO users (username, password_hash) VALUE (?, ?)",
      [username, hashedPassword]
    );
    return createSuccessMessage({
      affected_rows: res.affectedRows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}

export async function isValidCredentials(username, password) {
  let userInfo;
  try {
    userInfo = await pool.query(
      "SELECT (username, password_hash) FROM users WHERE username = ?", [username]
    );
  }
  catch (err) {
    return false;
  }

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
  let sql;
  let param;
  if (jorkId) {
    sql = "SELECT * FROM jorks WHERE jork_id = ?";
    param = [jorkId];
  }
  else {
    sql = "SELECT * FROM jorks";
    param = [];
  }

  try {
    const rows = await pool.query(sql, param);
    return createSuccessMessage({
      count: rows.length,
      jorks: rows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}

/**
 * Edit a jork. Only the start and end time can be modified.
 * @param {number} jorkId
 * @param {number} startTime
 * @param {number} endTime
 * @returns {object}
 */
export async function updateJorkInfo(jorkId, startTime, endTime) {
  try {
    const res = await pool.query(
      "UPDATE jorks SET start_time = ?, end_time = ? WHERE jork_id = ?", [startTime, endTime, jorkId]
    );
    return createSuccessMessage({
      affected_rows: res.affectedRows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}

export async function deleteJork(jorkId) {
  try {
    const res = await pool.query("DELETE FROM jorks WHERE jork_id = ?", [jorkId]);
    // TODO: handle jork ID not existing
    return createSuccessMessage({
      affected_rows: res.affectedRows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}

export async function addJork(songId, userId, startTime, endTime) {
  try {
    const res = await pool.query(
      "INSERT INTO jorks (song_id, user_id, start_time, end_time) VALUES (?, ?, ?, ?)",
      [songId, userId, startTime, endTime]
    );
    return createSuccessMessage({
      affected_rows: res.affectedRows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}

// SONG ACTIONS

export async function getSongInfo(songId) {
  let sql;
  let param;
  if (songId) {
    sql = "SELECT * FROM songs WHERE song_id = ?";
    param = [songId];
  }
  else {
    sql = "SELECT * FROM songs";
    param = [];
  }

  try {
    const rows = await pool.query(sql, param);
    return createSuccessMessage({
      count: rows.length,
      songs: rows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}

export async function updateSongInfo(songId, title, artist, releaseDate, duration, bpm, youtubeId) {
  try {
    const res = await pool.query(
      `UPDATE songs
      SET title = ?,
        artist = ?,
        release_date = ?,
        duration = ?,
        bpm = ?,
        youtube_id = ?
      WHERE song_id = ?`,
      [title, artist, releaseDate, duration, bpm, youtubeId, songId]
    );
    return createSuccessMessage({
      affected_rows: res.affectedRows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}

export async function deleteSong(songId) {
  try {
    const res = await pool.query("DELETE FROM songs WHERE song_id = ?", [songId]);
    // TODO: handle song ID not existing
    return createSuccessMessage({
      affected_rows: res.affectedRows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}

export async function addSong(title, artist, releaseDate, duration, bpm, youtubeId) {
  try {
    const res = await pool.query(
      `INSERT INTO songs (title, artist, release_date, duration, bpm, youtube_id) VALUES (?, ?, ?, ?, ?)`,
      [title, artist, releaseDate, duration, bpm, youtubeId]
    );
    return createSuccessMessage({
      affected_rows: res.affectedRows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}