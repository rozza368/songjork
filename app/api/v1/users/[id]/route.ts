// get user info
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  return Response.json({ message: `GET user ID ${id}` });
}

// update user info
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  return Response.json({ message: `PUT user ID ${id}` });
}

// remove user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  return Response.json({ message: `DELETE user ID ${id}` });
}
