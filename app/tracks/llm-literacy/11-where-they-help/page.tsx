import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Where LLMs Reliably Help (With Caveats) — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-literacy', '11-where-they-help');
  return (
    <LessonShell
      lessonId="llm-literacy/11-where-they-help"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title="Where LLMs Reliably Help (With Caveats)"
      estMinutes={10}
      nav={nav}
    >
      <p>
        Most of this track has been about failure modes. That isn&rsquo;t because
        LLMs aren&rsquo;t useful — it&rsquo;s because the failure modes are
        underdiscussed relative to the wins. This lesson restores some balance:
        here are the categories where LLMs reliably help, with the caveats that
        make them work.
      </p>
      <p>
        Every entry below is framed as <em>helps with X, under conditions Y,
        validated by Z</em>. That is the structure to apply when you make your
        own claims about LLM usefulness.
      </p>

      <h2>1. Drafting text you will heavily edit</h2>
      <p>
        <strong>Helps with:</strong> getting past blank-page paralysis on
        emails, summaries, doc outlines, status updates.
      </p>
      <p>
        <strong>Under:</strong> the output is short enough to read in full and
        you have the domain knowledge to fix errors.
      </p>
      <p>
        <strong>Validated by:</strong> you, doing a careful edit pass before
        anyone else sees it.
      </p>
      <p>
        <strong>Watch out for:</strong> accepting a draft you didn&rsquo;t
        meaningfully edit. The model&rsquo;s style and assumptions become yours
        by default if you just clean up surface issues.
      </p>

      <h2>2. Brainstorming options to filter</h2>
      <p>
        <strong>Helps with:</strong> generating a wide list of candidate names,
        approaches, test cases, edge cases, counterarguments — anything where
        breadth matters and you&rsquo;ll filter for quality afterwards.
      </p>
      <p>
        <strong>Under:</strong> you have a clear criterion for which ideas are
        worth keeping.
      </p>
      <p>
        <strong>Validated by:</strong> the filter step. You make the call on
        which options are actually good.
      </p>
      <p>
        <strong>Watch out for:</strong> taking the first plausible option without
        filtering. The model will happily generate one &ldquo;answer&rdquo;
        instead of options if you let it.
      </p>

      <h2>3. Format and structure conversion</h2>
      <p>
        <strong>Helps with:</strong> converting between data formats (text →
        JSON, prose → bullets, markdown → HTML), reformatting tables,
        extracting structured fields from unstructured text.
      </p>
      <p>
        <strong>Under:</strong> the input is short enough to read in full and
        the output structure is verifiable at a glance.
      </p>
      <p>
        <strong>Validated by:</strong> diffing input against output for any
        information loss; running the converted output through whatever
        downstream system expects it (does the JSON parse? does the SQL run?).
      </p>
      <p>
        <strong>Watch out for:</strong> silent loss — fields that don&rsquo;t
        appear in the output even though they were in the input.
      </p>

      <h2>4. Explaining unfamiliar text</h2>
      <p>
        <strong>Helps with:</strong> getting a starting interpretation of jargon,
        unfamiliar code, dense documentation, regulatory language.
      </p>
      <p>
        <strong>Under:</strong> the explanation is treated as a hypothesis you
        verify against a primary source, not the answer.
      </p>
      <p>
        <strong>Validated by:</strong> the source itself, or a colleague who
        knows the domain.
      </p>
      <p>
        <strong>Watch out for:</strong> the explanation feeling correct because
        it&rsquo;s articulate. This is the citation trap and the unverifiability
        trap combined.
      </p>

      <h2>5. Pair-programming on small, testable units</h2>
      <p>
        <strong>Helps with:</strong> writing short functions, regexes, SQL
        queries, shell one-liners, unit tests.
      </p>
      <p>
        <strong>Under:</strong> the unit is small enough to read line by line
        and there&rsquo;s a deterministic test (it runs, it returns the right
        type, it passes the cases you tried).
      </p>
      <p>
        <strong>Validated by:</strong> running the code on representative cases,
        including edge cases the model may not have considered.
      </p>
      <p>
        <strong>Watch out for:</strong> trusting code that compiles and looks
        clean but uses the wrong formula or misses an edge case. Confidently
        wrong code is one of the most common LLM failure modes.
      </p>

      <h2>6. Translating idiom-heavy text where context is shallow</h2>
      <p>
        <strong>Helps with:</strong> rough first-pass translation, especially
        for languages with strong representation in training data.
      </p>
      <p>
        <strong>Under:</strong> a native speaker can review for nuance before
        anything goes out.
      </p>
      <p>
        <strong>Validated by:</strong> that reviewer.
      </p>
      <p>
        <strong>Watch out for:</strong> idiomatic, legal, or culturally specific
        text where literal translation misleads.
      </p>

      <h2>The common pattern</h2>
      <p>
        Notice the structure: every entry has a verification step. The LLM
        accelerates a task whose verification is cheap and routine. When the
        verification is cheap, occasional errors are caught before they cost
        anything. When it isn&rsquo;t — that&rsquo;s when the unverifiability
        trap kicks in.
      </p>

      <blockquote>
        <strong>LLMs reliably help where the human still does the part the human
        is good at — judgment, context, validation — and the LLM does the part
        it&rsquo;s good at — generating plausible candidates fast.</strong>
      </blockquote>

      <MultipleChoice
        exerciseId="llm-literacy/11/quiz-1"
        prompt={
          <>
            Which of these is the strongest example of a &ldquo;reliable LLM
            use&rdquo; based on this lesson&rsquo;s framework?
          </>
        }
        options={[
          {
            id: 'a',
            text: '"The model handles all our customer support tickets autonomously."',
            rationale:
              'No human in the verification loop. The LLM is doing the load-bearing judgment, with no cheap external check.',
          },
          {
            id: 'b',
            text: '"Engineers get a code suggestion; they read it, run the tests, and commit it themselves."',
            correct: true,
            rationale:
              'Right. The human does the judgment, the model accelerates the draft, and there is a deterministic check (tests) before anything ships.',
          },
          {
            id: 'c',
            text: '"The AI summarizes legal contracts before we sign them."',
            rationale:
              'Load-bearing decision, no cheap verification path. Falls squarely into the unverifiability trap unless someone reads the contract.',
          },
          {
            id: 'd',
            text: '"The model drafts our annual report based on the financial data."',
            rationale:
              "Public-facing, high-stakes, and the verification step (reading the whole report against the data) is exactly as expensive as writing it without the LLM.",
          },
        ]}
      />

      <Reflection
        exerciseId="llm-literacy/11/reflection"
        prompt={
          <>
            Pick one place you actually use AI tools that fits this lesson&rsquo;s
            criteria — and one place you use them that <em>doesn&rsquo;t</em>.
            For the second, what would it take to make it fit? Or, alternatively:
            what would it take to honestly accept that use is high-risk and act
            accordingly?
          </>
        }
        modelAnswer={
          <>
            <p>
              The aim isn&rsquo;t to eliminate all the &ldquo;doesn&rsquo;t
              fit&rdquo; uses — sometimes the convenience genuinely outweighs the
              risk for a given task, and you accept that. The aim is to be aware
              of the trade you&rsquo;re making. Once you can name a use as
              high-risk, you&rsquo;ll make better decisions about which uses to
              keep, which to add guardrails to, and which to drop.
            </p>
            <p>
              A useful next step: take your &ldquo;doesn&rsquo;t fit&rdquo; case
              and ask whether you could shrink it (Lesson 8 framework). Often a
              high-risk use can be split into a low-risk LLM piece (find the
              candidates) and a high-touch human piece (decide).
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: privacy — what not to paste into a chatbot.
      </p>
    </LessonShell>
  );
}
