import { pool } from './connection';
const argon2 = require('argon2');

function createSuccessMessage(data) {
  return {status: "success", ...data};
}

function createErrorMessage(err) {
  return {status: "error", message: err};
}

// USER ACTIONS

export async function getUserInfo(userId) {
  let sql;
  let param = [];
  if (userId) {
    sql = "SELECT * FROM users WHERE user_id = ?";
  }
  else {
    sql = "SELECT * FROM users";
    param.push(userId);
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

export async function updateUserInfo(userId, newInfo) {
  // TODO
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
  let param = [];
  if (jorkId) {
    sql = "SELECT * FROM jorks WHERE jork_id = ?";
  }
  else {
    sql = "SELECT * FROM jorks";
    param.push(jorkId);
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

  try {
    const res = await pool.query(`UPDATE jorks SET ${placeholderString} WHERE jork_id = ?`, params);
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

export async function addJork(jorkInfo) {
  const { songId, userId, startTime, endTime } = jorkInfo;

  // all parameters must be present
  if (!songId || !userId || !startTime || !endTime)
    return null;

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
  let param = [];
  if (songId) {
    sql = "SELECT * FROM songs WHERE song_id = ?";
  }
  else {
    sql = "SELECT * FROM songs";
    param.push(songId);
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

export async function updateSongInfo(songId, newInfo) {
  // TODO
  try {
    const res = await pool.query("UPDATE songs SET ? WHERE song_id = ?", [songId]);
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

export async function addSong(songInfo) {
  const { title, artist, releaseDate, duration, bpm } = songInfo;

  // these parameters must be present
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

  try {
    const res = await pool.query(
      `INSERT INTO songs (${fields.join(", ")}) VALUES (?, ?, ?, ?, ?)`,
      values
    );
    return createSuccessMessage({
      affected_rows: res.affectedRows,
    });
  }
  catch (err) {
    return createErrorMessage(err);
  }
}