// get all users
export async function GET() {
  return Response.json({ message: 'GET users' });
}

// add a user
export async function POST() {
  return Response.json({ message: 'POST users' });
}
