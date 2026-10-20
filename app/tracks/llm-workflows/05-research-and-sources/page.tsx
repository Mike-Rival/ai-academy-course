import Link from 'next/link';
import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Research With Web-Enabled and Deep-Research Modes — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-workflows', '05-research-and-sources');
  return (
    <LessonShell
      lessonId="llm-workflows/05-research-and-sources"
      trackLabel="Getting Work Done with LLMs"
      trackHref="/tracks/llm-workflows"
      title="Research With Web-Enabled and Deep-Research Modes"
      estMinutes={15}
      nav={nav}
    >
      <p>
        Most LLM tools can now search the web, and several offer a
        &ldquo;deep research&rdquo; mode that runs many searches, reads
        dozens of pages, and returns a long report with footnotes. These are
        genuinely useful. They are also the place where the{' '}
        <Link href="/tracks/llm-literacy/05-citation-trap">citation trap</Link>{' '}
        from the literacy track evolves into something harder to spot.
      </p>
      <p>
        The literacy lesson described three kinds of bad citation: a
        fabricated source, a real source that was not consulted, and a real
        source that was consulted but misread. Web access mostly fixes the
        first one. It does little for the third, and it adds a fourth: a real
        source that was consulted, that says what the report claims, and that
        is itself wrong, out of date, or an advertisement.
      </p>

      <h2>What web access changes and what it does not</h2>
      <p>
        With browsing, the footnote usually points at a page that exists.
        That is real progress. But a report that reads twenty pages and
        synthesizes them is making hundreds of small judgment calls: which
        page to trust when two disagree, whether a 2019 figure still holds,
        whether the confident blog post is written by someone who knows. You
        see the conclusions. You do not see the calls.
      </p>
      <p>
        And the report is long. A ten-page research summary with forty
        footnotes feels thorough in a way a four-line chat answer does not.
        That feeling is the unverifiability trap in a new suit: the more
        work the tool visibly did, the less inclined you are to check it,
        and the more expensive checking becomes.
      </p>

      <h2>The research workflow</h2>

      <h3>1. Write the question down first</h3>
      <p>
        Before you prompt, write one sentence stating what you need to know
        and what decision it feeds. &ldquo;Which three vendors should we
        shortlist for payroll software, for a 200-person company, and what
        would disqualify each?&rdquo; A deep-research run on a vague question
        returns a vague report that is impossible to verify because there is
        nothing specific to verify it against.
      </p>

      <h3>2. Ask for sources per claim, not per report</h3>
      <p>
        A bibliography at the end is nearly useless for verification. Ask
        for the structure that makes checking cheap: &ldquo;For every
        factual claim, cite the specific page, and quote the sentence from
        that page that supports it. Mark any claim you could not find a
        source for as [unsourced].&rdquo; The quoted sentence is what you
        will check. The [unsourced] marker is what stops the model from
        filling gaps silently.
      </p>

      <h3>3. Open the sources that carry weight</h3>
      <p>
        You will not open all forty. Open the ones the conclusion depends
        on: if the report says vendor B is cheapest, open the page the price
        came from. For each one you open, check three things:
      </p>
      <ul>
        <li><strong>Does the page say what the quote says?</strong> Search the page for the quoted sentence. Models paraphrase inside quotation marks more than you would expect.</li>
        <li><strong>Who wrote it and when?</strong> A vendor&rsquo;s own pricing page is accurate about that vendor and silent about the rest. A comparison article may be sponsored. A figure with no date is a figure you cannot use.</li>
        <li><strong>Is the claim in context?</strong> The sentence may be true and the paragraph around it may add &ldquo;except for companies over 100 employees.&rdquo;</li>
      </ul>

      <h3>4. Triangulate the claims that matter</h3>
      <p>
        For anything that will change the decision, find a second,
        independent source. Independent means not citing the same original
        page: three articles that all repeat one press release are one
        source. If you cannot find a second source for a load-bearing claim,
        downgrade it to &ldquo;reported by one party&rdquo; in your notes and
        say so when you pass it on.
      </p>

      <h3>5. Separate what you verified from what you did not</h3>
      <p>
        When you write up the result, mark it. &ldquo;Pricing confirmed on
        vendor sites as of this week. Feature comparison from the research
        report, not independently checked.&rdquo; This costs one sentence and
        it is the difference between a colleague trusting your note
        appropriately and trusting it too much.
      </p>

      <h2>Knowing when to stop</h2>
      <p>
        Research has no natural end, and deep-research tools make it cheap
        to keep going: one more run, one more angle. Set a stop rule before
        you start. Two that work:
      </p>
      <ul>
        <li><strong>Decision-based:</strong> stop when the load-bearing claims are triangulated and the decision would not change with more information. If you have three vendors and clear disqualifiers for two, you are done, even if the report could be longer.</li>
        <li><strong>Budget-based:</strong> stop at a fixed time, then write up what you verified and what you did not. A time box forces the verified/unverified split to be explicit instead of pretending the research was complete.</li>
      </ul>
      <p>
        The failure to watch for is the opposite of laziness: the person who
        runs five deep-research reports, reads none of the sources, and
        presents a confident synthesis of synthesis. More runs do not add
        verification. Only opening the pages does.
      </p>

      <blockquote>
        <strong>Web access makes the footnotes real. It does not make them
        right. Open the sources the decision depends on, triangulate those,
        and label everything else as unverified.</strong>
      </blockquote>

      <MultipleChoice
        exerciseId="llm-workflows/05/quiz-1"
        prompt={
          <>
            A deep-research report on competitor pricing cites eighteen
            pages. You have fifteen minutes before the meeting. What is the
            best use of that time?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Skim the whole report for anything that looks off.',
            rationale:
              'Looking for things that "look off" catches implausible claims and misses the plausible wrong ones, which are the dangerous kind. Fifteen minutes of skimming produces a feeling of having checked, not a check.',
          },
          {
            id: 'b',
            text: 'Open the two or three sources behind the numbers the meeting will actually decide on, confirm the quotes and dates, and mark the rest of the report as unverified.',
            correct: true,
            rationale:
              'Right. Verification effort goes where the cost of error is. Confirming the load-bearing figures takes most of the fifteen minutes and leaves you able to say exactly what you checked.',
          },
          {
            id: 'c',
            text: 'Run the same research again in a different tool and see if the answers agree.',
            rationale:
              'Two models reading the same web pages will often agree, including when the pages are wrong. Agreement between tools is not triangulation; independent sources are.',
          },
          {
            id: 'd',
            text: 'Ask the model to rate its confidence in each claim and focus on the low ones.',
            rationale:
              'Self-reported confidence is not calibrated to correctness; the literacy track covered this directly. The high-confidence wrong claim is the one this approach guarantees you will miss.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-workflows/05/quiz-2"
        prompt={
          <>
            Which of these counts as triangulating a claim that &ldquo;Vendor
            C raised prices 20% in March&rdquo;?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Three news articles that all report the increase.',
            rationale:
              'Only if they are independent. If all three cite the same press release or each other, that is one source reported three times. Check what each article is citing.',
          },
          {
            id: 'b',
            text: 'Vendor C’s own pricing page showing the new price, plus an archived copy of the page from February showing the old one.',
            correct: true,
            rationale:
              'Right. Two independent observations of the underlying fact: what the price was and what it is. Neither depends on anyone’s reporting of the change.',
          },
          {
            id: 'c',
            text: 'The research report cites it, and a second research run in another tool also cites it.',
            rationale:
              'Both tools likely read the same page. Two syntheses of one source is still one source.',
          },
          {
            id: 'd',
            text: 'A colleague remembers hearing about it.',
            rationale:
              'Memory of hearing something is the weakest form of evidence here, and probably traces back to the same article. Useful as a prompt to go check, not as confirmation.',
          },
        ]}
      />

      <Reflection
        exerciseId="llm-workflows/05/reflection"
        prompt={
          <>
            Think of a research question you would plausibly hand to a
            deep-research tool this month. Write the one-sentence version of
            the question, the decision it feeds, and your stop rule. Which two
            or three claims in the eventual report would you commit to opening
            the sources for?
          </>
        }
        modelAnswer={
          <>
            <p>
              Example: &ldquo;Which of the three note-taking tools we are
              considering can export everything in an open format, for a
              decision about which one to adopt team-wide? Stop when the
              export claim is confirmed or refuted on each vendor&rsquo;s own
              documentation.&rdquo;
            </p>
            <p>
              The claims to open: the export claim for each tool, from the
              vendor&rsquo;s docs, not a review. Everything else in the
              report (pricing tiers, feature lists, user sentiment) is
              context, and context can stay unverified as long as it is
              labeled that way.
            </p>
            <p>
              Notice how much smaller the verification job is once the
              decision is named. Without the decision, every claim in a
              forty-footnote report looks equally worth checking, which
              means none of them get checked.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: text into tables, tables into text, and letting the
        spreadsheet do the verifying.
      </p>
    </LessonShell>
  );
}
