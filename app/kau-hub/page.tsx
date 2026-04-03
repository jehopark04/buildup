import { kauShortcutLinks } from "@/lib/kau-links";

export const metadata = {
  title: "KAU HUB",
};

export default function KauHubPage() {
  const groupedLinks = kauShortcutLinks.reduce<Record<string, typeof kauShortcutLinks>>(
    (accumulator, link) => {
      const current = accumulator[link.group] ?? [];
      accumulator[link.group] = [...current, link];
      return accumulator;
    },
    {},
  );

  return (
    <main className="space-y-10">
      <section className="card-shadow rounded-[30px] border border-line bg-white p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
          KAU Hub
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          한국항공대학교 활동 바로가기
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
          학내 공지와 학생 참여 채널을 한 번에 모아둔 허브입니다.
        </p>
      </section>

      <section className="space-y-10">
        {Object.entries(groupedLinks).map(([group, links]) => (
          <div key={group} className="space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight text-muted">
              {group}
            </h2>
            <div className="grid gap-4">
              {links.map((link) => (
                <a
                  key={link.title}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card-shadow rounded-[28px] border border-line bg-white px-6 py-6 transition hover:-translate-y-1 hover:border-foreground/15"
                >
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    {link.title}
                  </p>
                  <p className="mt-4 text-base leading-8 text-muted">
                    {link.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
