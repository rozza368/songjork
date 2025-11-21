import { getUserInfo, addUser } from '@/app/util/dbActions';
import { type NextRequest } from "next/server";

// get all users
export async function GET(
  request: NextRequest
) {
  const userInfo = await getUserInfo();
  const searchParams = request.nextUrl.searchParams;
  return Response.json({ ...userInfo, params: searchParams.toString() });
}

// add a user
export async function POST(request: Request) {
  const { username, password } = await request.json();
  const result = await addUser(username, password);
  return Response.json(result);
}
