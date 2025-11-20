import { getUserInfo, addUser } from '@/app/util/dbActions';
import { type NextRequest } from "next/server";

// get all users
export async function GET(
  request: NextRequest
) {
  const rows = await getUserInfo();
  const searchParams = request.nextUrl.searchParams;
  return Response.json({ status: "success", message: rows, params: searchParams.toString() });
}

// add a user
export async function POST(request: Request) {
  const { username, password } = await request.json();
  console.log(username, password);
  const result = await addUser(username, password);
  console.log(result);
  return Response.json({ status: "success", message: result });
}
