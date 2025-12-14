"use client";

import useSWR from "swr";
import { jorkAPI, fetcher } from "@/app/util/globals";

function serializeJork(data: jorkAPI) {
  const { status, jorks } = data;
  const jork = jorks[0];
  return (
    <>
      <p>ID: {jork.jork_id}</p>
      <p>Song ID:{jork.song_id}</p>
      <p>Start time: {jork.start_time}</p>
      <p>End time: {jork.end_time}</p>
    </>
  )
}

export default function JorkView({ id }: { id: number }) {
  const url = `/api/v1/jorks/${id}`;
  const { data, error }: { data: jorkAPI, error: any } = useSWR(url, fetcher);

  if (!data) return <p>Loading...</p>
  if (error) return <p>Failed to load: {error}</p>

  return (
    <>
      <p>You are viewing Jork #{id}</p>
      {serializeJork(data)}
    </>
  )
}