import type { Metadata } from "next";
import { Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import SocialLinks from "@/components/SocialLinks";
import { getProfile } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's Work Together"
        intro="Fill out the form with your contact details and request, and I'll reply as soon as I can."
      />
      <section className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_320px]">
        <ContactForm />
        <aside className="card h-fit space-y-4 p-6">
          <h2 className="flex items-center gap-2 text-2xl">
            <Mail className="h-6 w-6 text-cat-yellow" aria-hidden /> Prefer email?
          </h2>
          <a href={`mailto:${profile.email}`} className="block break-all text-cat-yellow hover:underline">
            {profile.email}
          </a>
          <SocialLinks profile={profile} variant="icons" />
        </aside>
      </section>
    </>
  );
}
