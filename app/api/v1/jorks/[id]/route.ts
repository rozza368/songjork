// retrieve info about jork
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  return Response.json({ message: `GET jork ID ${id}` });
}

// update a jork
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  return Response.json({ message: `PUT jork ID ${id}` });
}

// delete a jork
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  return Response.json({ message: `DELETE jork ID ${id}` });
}