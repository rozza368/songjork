import { deleteUser, getUserInfo, updateUserName, updateUserPassword } from "@/app/util/dbActions";

// get user info
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const userInfo = await getUserInfo(id);
  return Response.json(userInfo);
}

// update user info
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const { username, password } = await request.json();
  let res1, res2;
  if (username)
    res1 = await updateUserName(id, username);
  if (password)
    res2 = await updateUserPassword(id, password);

  return Response.json({ status: "success", username: res1, password: res2 });
}

// remove user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const result = await deleteUser(id);
  return Response.json(result);
}
