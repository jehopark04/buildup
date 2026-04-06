import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "문의하기",
};

export default function ContactPage() {
  return (
    <main className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
      <section className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
          BuildUp Contact
        </p>
        <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          불편했던 점이나
          <br />
          원하는 기능을 알려주세요.
        </h1>
        <p className="max-w-xl text-base leading-7 text-muted">
          긴 설명 없이 바로 내용만 적어도 됩니다. BUILDUP을 더 편하게 쓰도록 반영할게요.
        </p>
        <div className="space-y-3 rounded-[30px] border border-line bg-surface p-5">
          <p className="text-sm font-semibold text-foreground">문의는 이렇게 보내주세요</p>
          <ul className="space-y-2 text-sm leading-6 text-muted">
            <li>불편했던 화면이나 흐름을 그대로 적어주세요</li>
            <li>원하는 기능이나 개선 아이디어도 괜찮습니다</li>
            <li>답장을 원하면 본문에 연락처를 함께 남겨주세요</li>
          </ul>
        </div>
      </section>

      <ContactForm />
    </main>
  );
}
