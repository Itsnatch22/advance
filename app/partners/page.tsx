import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const bankingPartners = [
  { src: "/partners/equity.svg", name: "Equity Bank" },
  { src: "/partners/kcb.svg", name: "KCB Bank" },
  { src: "/partners/coop.svg", name: "Co-operative Bank" },
  { src: "/partners/stanbic.svg", name: "Stanbic Bank" },
  { src: "/partners/ncba.svg", name: "NCBA Bank" },
  { src: "/partners/family.svg", name: "Family Bank" },
];

const corporatePartners = [
  { src: "/partners/naivas.svg", name: "Naivas" },
  { src: "/partners/carrefour.png", name: "Carrefour" },
  { src: "/partners/mayfair.svg", name: "Mayfair" },
  { src: "/partners/eabl.svg", name: "East African Breweries" },
  { src: "/partners/jubilee.png", name: "Jubilee Insurance" },
  { src: "/partners/CIC.png", name: "CIC Insurance" },
];

const PartnerLogo = ({ src, name }: { src: string; name: string }) => {
  return (
    <div className="flex h-24 items-center justify-center rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-emerald-300">
      <Image
        src={src}
        alt={name}
        width={140}
        height={48}
        className="h-10 w-auto max-w-full object-contain"
      />
    </div>
  );
};

function SectionHeader({
  title,
  highlightWord,
  description,
}: {
  title: string;
  highlightWord?: string;
  description: string;
}) {
  return (
    <div className="max-w-xl space-y-3">
      <h2 className="font-serif text-2xl leading-tight font-bold tracking-tight text-slate-900 sm:text-3xl">
        {highlightWord ? (
          <>
            {title.slice(0, -highlightWord.length)}
            <span className="text-emerald-700">{highlightWord}</span>
          </>
        ) : (
          title
        )}
      </h2>
      <p className="text-base leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}

function PartnerSection({
  title,
  highlightWord,
  description,
  partners,
  reverse = false,
}: {
  title: string;
  highlightWord?: string;
  description: string;
  partners: { src: string; name: string }[];
  reverse?: boolean;
}) {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20">
      <div
        className={`mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14 lg:px-8 ${reverse ? "lg:grid-flow-dense" : ""}`}
      >
        <div className={reverse ? "lg:col-start-2" : ""}>
          <SectionHeader
            title={title}
            highlightWord={highlightWord}
            description={description}
          />
        </div>

        <div
          className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${reverse ? "lg:col-start-1" : ""}`}
        >
          {partners.map((partner) => (
            <PartnerLogo
              key={partner.name}
              src={partner.src}
              name={partner.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PartnersPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50/70 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">
            Our Partners
          </p>

          <h1 className="max-w-4xl font-serif text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl">
            <span className="text-emerald-700">Built for the teams</span>{" "}
            powering Africa&apos;s workforce.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Banks. Corporates. Technology platforms. We partner with the people
            who move money securely and at scale.
          </p>
        </div>
      </section>

      <PartnerSection
        title="Built for institutions like"
        highlightWord="like"
        description="Designed to work with the regulated financial infrastructure powering East Africa."
        partners={bankingPartners}
      />

      <PartnerSection
        title="Built for employers like"
        highlightWord="like"
        description="From retail to manufacturing, EaziWage supports the organisations that power East Africa's workforce."
        partners={corporatePartners}
        reverse
      />

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-9 lg:p-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <h3 className="font-serif text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Want to partner with{" "}
                  <span className="text-emerald-700">EaziWage?</span>
                </h3>

                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  We&apos;re always open to working with forward-thinking teams.
                </p>
              </div>

              <Link
                href="/partners/onboarding"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 motion-reduce:transition-none"
              >
                <span>Apply for Partnership</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
