import { type NextRequest } from "next/server";

// retrieve info about jork
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  return Response.json({ status: "success", message: `GET jork ID ${id}`, params: searchParams.toString() });
}

// update a jork
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  return Response.json({ status: "success", message: `PUT jork ID ${id}` });
}

// delete a jork
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  return Response.json({ status: "success", message: `DELETE jork ID ${id}` });
}