import { pool, dbSetup } from '../../../util/connection';

export async function GET() {
  await dbSetup();
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM jorks");
    console.log(rows); //[ {val: 1}, meta: ... ]
    return Response.json({ message: rows })
  } catch (err) {
    return Response.json({ message: 'ERROR' })
    // throw err;
  } finally {
    if (conn) conn.end();
  }
}