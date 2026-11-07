import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ShowcaseGrid from "@/components/ShowcaseGrid";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = { title: "Showcase" };

export default async function ShowcasePage() {
  const entries = await getProjects();

  return (
    <>
      <PageHeader
        eyebrow="Showcase"
        title="Projects & Awards"
        intro="A selection of work I've built and recognition I've earned."
      />
      <section className="container-page py-12">
        <ShowcaseGrid entries={entries} />
      </section>
    </>
  );
}
