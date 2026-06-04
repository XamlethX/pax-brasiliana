import { redirect } from "next/navigation";

export default function EssaySlugRedirect({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/ensaios/${params.slug}`);
}
