/* eslint-disable @next/next/no-img-element -- photo path is editable and may be any URL */
import Link from "next/link";
import { ArrowRight, Briefcase, GraduationCap, MapPin } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import SocialLinks from "@/components/SocialLinks";
import Timeline from "@/components/Timeline";
import { getProfile } from "@/lib/content";
import { NAV_ITEMS } from "@/lib/nav";

export default async function HomePage() {
  const profile = await getProfile();
  const panels = NAV_ITEMS.filter((item) => item.href !== "/");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-cat-line">
        <div
          className="absolute -right-32 -top-32 h-96 w-96 rotate-12 bg-cat-yellow/10 blur-3xl"
          aria-hidden
        />
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-[auto_1fr] md:py-24">
          <FadeIn className="mx-auto md:mx-0">
            <div className="relative">
              <div className="hazard-stripe absolute -inset-3 rounded-2xl" aria-hidden />
              <img
                src={profile.photo}
                alt={`Photo of ${profile.name}`}
                className="relative h-56 w-56 rounded-xl border-4 border-cat-black object-cover sm:h-64 sm:w-64 lg:h-72 lg:w-72"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="text-center md:text-left">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cat-yellow">Hello, I&apos;m</p>
            <h1 className="text-5xl leading-none sm:text-6xl lg:text-7xl">{profile.name}</h1>
            <p className="mt-4 inline-block bg-cat-yellow px-3 py-1 font-display text-xl uppercase tracking-wide text-cat-black sm:text-2xl">
              {profile.title}
              {profile.company && ` · ${profile.company}`}
            </p>
            {profile.location && (
              <p className="mt-3 flex items-center justify-center gap-1 text-cat-gray md:justify-start">
                <MapPin className="h-4 w-4" aria-hidden /> {profile.location}
              </p>
            )}
            <p className="mt-6 max-w-2xl text-lg text-neutral-300">{profile.bio}</p>
            <div className="mt-8 flex justify-center md:justify-start">
              <SocialLinks profile={profile} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Page panels */}
      <section className="container-page py-14" aria-labelledby="explore-heading">
        <h2 id="explore-heading" className="mb-6 text-3xl">
          Explore
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {panels.map(({ href, label, description, icon: Icon }, i) => (
            <FadeIn key={href} delay={i * 0.1}>
              <Link
                href={href}
                className="card group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:border-cat-yellow"
              >
                <Icon className="h-10 w-10 text-cat-yellow" aria-hidden />
                <h3 className="mt-4 text-2xl">{label}</h3>
                <p className="mt-2 flex-1 text-cat-gray">{description}</p>
                <span className="mt-4 flex items-center gap-2 font-semibold text-cat-yellow">
                  Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Work & education */}
      <section className="container-page grid gap-6 lg:grid-cols-2">
        <FadeIn>
          <Timeline title="Work History" icon={Briefcase} entries={profile.work} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <Timeline title="Education" icon={GraduationCap} entries={profile.education} />
        </FadeIn>
      </section>
    </>
  );
}
