import { pool } from 'connection';

// USER ACTIONS

export async function getUserInfo(userId) {}

export async function updateUserInfo(userId, newInfo) {}

export async function deleteUser(userId) {}

export async function addUser(username, password) {}

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