import { addJork, getJorkInfo } from '@/app/util/dbActions';

export async function GET() {
  const jorkInfo = await getJorkInfo();
  return Response.json(jorkInfo);
}

export async function POST(request: Request) {
  const { song_id, user_id, start_time, end_time } = await request.json();
  const result = await addJork(song_id, user_id, start_time, end_time);
  return Response.json(result);
}