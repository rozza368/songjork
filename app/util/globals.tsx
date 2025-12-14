// swr fetcher
export const fetcher = (...args) => fetch(...args).then((res) => res.json());

// Single Jork
export type jorkInfo = {
  jork_id: number,
  song_id: number,
  start_time: number,
  end_time: number,
}

// API request
export type jorkAPI = {
  status: string,
  count: number,
  jorks: jorkInfo[],
  params: string
}
