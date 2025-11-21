import { deleteJork, getJorkInfo, updateJorkInfo } from "@/app/util/dbActions";
import { type NextRequest } from "next/server";

// retrieve info about jork
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const jorkInfo = await getJorkInfo(id);
  return Response.json({...jorkInfo, params: searchParams.toString()});
}

// update a jork
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const { start_time, end_time } = await request.json();
  const result = await updateJorkInfo(id, start_time, end_time);
  return Response.json(result);
}

// delete a jork
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const result = await deleteJork(id);
  return Response.json(result);
}