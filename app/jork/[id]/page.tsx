import JorkView from "@/app/ui/JorkView";

export default async function Page(
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;

  return (
    <JorkView id={id} />
  )
}