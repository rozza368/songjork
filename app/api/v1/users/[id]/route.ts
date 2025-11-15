import { deleteUser, getUserInfo, updateUserInfo } from "@/app/util/dbActions";

// get user info
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const rows = await getUserInfo(id);
  return Response.json({ message: `GET user ID ${id}`, result: rows });
}

// update user info
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const result = await updateUserInfo(id, null); // TODO
  return Response.json({ message: `PUT user ID ${id}` });
}

// remove user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const result = await deleteUser(id);
  return Response.json({ message: `DELETE user ID ${id}`, result: result });
}
