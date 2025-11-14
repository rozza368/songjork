export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  return Response.json({ message: `jork ID ${id}` });
}