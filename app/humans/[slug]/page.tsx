import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamMemberProfile } from "../TeamMemberProfile";
import { people } from "../people";

interface TeamMemberPageProps {
  params: Promise<{ slug: string }>;
}

function getPerson(slug: string) {
  return people.find((person) => person.slug === slug);
}

export function generateStaticParams() {
  return people.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: TeamMemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);

  if (!person) return {};

  return {
    title: person.name,
    description: `${person.name}, ${person.role} at EaziWage.`,
    openGraph: {
      title: `${person.name} | EaziWage`,
      description: `${person.name}, ${person.role} at EaziWage.`,
      url: `https://eaziwage.com/humans/${person.slug}`,
      images: [person.image],
    },
  };
}

export default async function TeamMemberPage({
  params,
}: TeamMemberPageProps) {
  const { slug } = await params;
  const person = getPerson(slug);

  if (!person) notFound();

  return <TeamMemberProfile person={person} />;
}
