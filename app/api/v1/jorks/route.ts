import { addJork, getUserInfo } from '@/app/util/dbActions';

export async function GET() {
  const userInfo = await getUserInfo();
  return Response.json({ status: "success", message: userInfo });
}

export async function POST(request: Request) {
  const jorkInfo = await request.json();
  const result = await addJork(jorkInfo);
  return Response.json({ status: "success", message: result });
}