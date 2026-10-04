import { TopNav } from "@/components/TopNav";

export const dynamic = "force-dynamic";

export default function HelpPage() {
  return (
    <main className="sp-page pt-12">
      <TopNav />
      <div className="max-w-[820px] mx-auto px-4 md:px-6 py-10">
        <h1 className="sp-h1 mb-2">Help</h1>
        <p className="text-[14px] text-[#666] mb-10">
          What everything on this site actually does, in plain terms.
        </p>

        <Section title="Subjects and tabs">
          <p>
            The row of buttons under the page title on Territory (the home page) switches subjects — Taxation
            Law, and whatever else has notes under its own folder. Whatever subject is selected follows you
            across every page (Practice, Error book, Standing, Block, Duel) until you switch it again. It is
            stored in a cookie on this browser, so different devices can be on different subjects.
          </p>
          <p>
            All your progress — rounds, test attempts, error book, block log — is kept separately per subject.
            Switching subjects doesn&apos;t erase or mix anything; it just changes which set of numbers you&apos;re
            looking at.
          </p>
        </Section>

        <Section title="Topics and topic state">
          <p>
            Every topic note in the vault (a <code>node:</code> tagged Markdown file) shows up on Territory
            grouped by unit. A topic&apos;s state — <strong>unstudied</strong>, <strong>studied</strong>,{" "}
            <strong>mapped</strong>, or <strong>drilled</strong> — isn&apos;t set by hand; it&apos;s derived
            straight from which rounds you&apos;ve marked done for that topic:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>No round done &rarr; <strong>unstudied</strong></li>
            <li>R1 done &rarr; <strong>studied</strong></li>
            <li>R2 done &rarr; <strong>mapped</strong></li>
            <li>R3 done &rarr; <strong>drilled</strong></li>
          </ul>
          <p>
            Open a topic to read its note, then mark rounds done from the round chips on that page or from the
            Territory unit board. Minutes remaining, topic counts, and the treemap on Territory all update from
            the same round data.
          </p>
        </Section>

        <Section title="Rounds — R1, R2, R3">
          <p>
            The three passes every topic goes through, tracked independently per topic:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li><strong>R1</strong> — first pass: read the note, study it, work through flashcards, take the mini test for that topic.</li>
            <li><strong>R2</strong> — error-book revisit: go back over the note with your logged mistakes in mind.</li>
            <li><strong>R3</strong> — full mock papers, once every topic has had its first two passes.</li>
          </ul>
          <p>
            &ldquo;Up next&rdquo; on Territory always points at the earliest round not yet done, in topic order —
            it moves on to R2 for everyone only once every topic has R1, and to R3 only once every topic has R2.
            Marking a whole unit&apos;s round at once is available from each unit panel; marking one topic at a
            time is available everywhere a round chip shows up.
          </p>
        </Section>

        <Section title="Practice: mini, sectional, and mock tests">
          <p>The Practice hub lists every unit and node with a question count. Three kinds of papers:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li><strong>Mini test</strong> — just the questions for one node. The natural thing to do right after reading a topic, as part of R1.</li>
            <li><strong>Sectional test</strong> — every question in one unit, timed.</li>
            <li><strong>Full mock</strong> — the full paper across the whole bank: a mix of short, long, and case questions, timed. This is the R3 activity.</li>
          </ul>
          <p>
            MCQs are marked automatically. For short/long/case answers, write your answer (on paper or in the
            box — either works), then reveal the model answer and tick which marking-scheme points you actually
            hit; the running score updates as you tick. An in-progress paper is saved automatically, so leaving
            and coming back resumes exactly where you left off (the &ldquo;Resume&rdquo; label on a hub button
            means there&apos;s a paper waiting).
          </p>
          <p>
            After marking, anything short of full marks can be logged straight to the error book from the
            results screen — one at a time, or all misses at once.
          </p>
        </Section>

        <Section title="Error book and the re-solve schedule">
          <p>
            Every miss — logged from a test&apos;s results screen, or typed in manually — becomes an entry with
            what you did, why, the correct method, and how to avoid it next time. Entries follow a fixed spaced
            re-solve schedule:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Logged today &rarr; due to re-solve in <strong>1 day</strong>.</li>
            <li>Re-solved clean once &rarr; due again in <strong>3 days</strong>.</li>
            <li>Re-solved clean twice in a row &rarr; due again in <strong>7 days</strong>.</li>
            <li>Re-solved clean <strong>three times in a row</strong> &rarr; marked <strong>mastered</strong>, done.</li>
            <li>Any re-solve that isn&apos;t clean resets the clean streak and comes back in 1 day.</li>
          </ul>
          <p>
            &ldquo;Clean&rdquo; means right method, no slips, without peeking at the answer while attempting it —
            that judgment call is yours after each re-solve. The Error book page shows what&apos;s due today up
            top, with the full list filterable by unit, node, type, and status below. Export/import (JSON) backs
            up or restores attempts, errors, blocks, and round progress by hand.
          </p>
        </Section>

        <Section title="Block timer">
          <p>
            A study block is 45 minutes of studying followed by 15 minutes of logging errors — 60 minutes total.
            Start one from the Block page (optionally pick a round and a node), and the countdown in the top bar
            follows you to any page. When the study phase ends it switches into the log phase automatically and
            points you at the Error book; when the whole block ends it&apos;s logged to your history, whether you
            end it yourself or just let the clock run out.
          </p>
        </Section>

        <Section title="Sync across devices">
          <p>
            Everything is stored locally in this browser by default. To carry progress to another device, click{" "}
            <strong>Sync</strong> in the top bar — it gives you a link in the form <code>/?sync=&lt;key&gt;</code>.
            Opening that same link on another device links it to the same progress record; from then on both
            devices quietly pull and push changes (on load, when a tab becomes visible again, and a few seconds
            after anything changes). Anyone holding the link can read and write that record, so treat it like a
            shared document link, not a password.
          </p>
          <p>
            Sync only needs configuring once per deployment (a Redis store behind the scenes); if it isn&apos;t
            configured, the Sync button will say so and everything just stays local to the device.
          </p>
        </Section>

        <Section title="Duel and the leaderboard">
          <p>
            The Duel page is a small leaderboard: pick a name once to join, and your R1/R2/R3 counts and drilled
            total start showing up next to everyone else who&apos;s joined, ranked by drilled count. Joining also
            links this device the same way Sync does, so it can be pulled up on another device with the link
            you&apos;re given.
          </p>
          <p>
            The leaderboard is scored against whichever subject tab you currently have selected — it has no
            subject switcher of its own. If a friend is ahead on Taxation but you&apos;re both looking at the
            board with SAPM selected, they&apos;ll show 0 there rather than their real Taxation numbers.
          </p>
        </Section>

        <Section title="Standing and Timeline">
          <p>
            Standing is the numbers view: hours per round, latest/best/attempts per unit and node with a trend
            sparkline, sectional and mock history, and an error-type breakdown. Timeline is the raw activity log
            — every topic-state change, on every synced device, in order.
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="sp-h2 border-b border-[color:var(--sp-accent)] pb-2 mb-3">{title}</h2>
      <div className="flex flex-col gap-3 text-[14.5px] text-[#333] leading-relaxed">{children}</div>
    </section>
  );
}
