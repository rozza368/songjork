import { getUserInfo, addUser } from '@/app/util/dbActions';

// get all users
export async function GET() {
  const rows = await getUserInfo();
  return Response.json({ message: rows });
}

// add a user
export async function POST(request: Request) {
  const { username, password } = await request.json();
  console.log(username, password);
  const result = await addUser(username, password);
  console.log(result);
  return Response.json({ message: result });
}
