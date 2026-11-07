import FadeIn from "./FadeIn";

type Props = { eyebrow: string; title: string; intro?: string };

export default function PageHeader({ eyebrow, title, intro }: Props) {
  return (
    <section className="border-b border-cat-line bg-cat-charcoal">
      <FadeIn className="container-page py-12 sm:py-16">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-cat-yellow">{eyebrow}</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-cat-gray">{intro}</p>}
      </FadeIn>
    </section>
  );
}
