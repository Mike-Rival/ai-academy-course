import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Reading "LLMs Are Good at X" Claims — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-literacy', '10-reading-claims');
  return (
    <LessonShell
      lessonId="llm-literacy/10-reading-claims"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title='Reading "LLMs Are Good at X" Claims'
      estMinutes={12}
      nav={nav}
    >
      <p>
        You will see claims of the form <em>&ldquo;LLMs are good at X&rdquo;</em>{' '}
        constantly — in blog posts, vendor pitches, internal slack messages,
        leadership announcements. Most of them are unfalsifiable as stated. This
        lesson teaches you to read them critically.
      </p>

      <h2>What&rsquo;s wrong with &ldquo;good at X&rdquo;</h2>
      <p>
        &ldquo;Good&rdquo; is doing too much work. Good compared to what? Good for
        whom? Good on which examples, judged how? &ldquo;Good at coding&rdquo;
        could mean &ldquo;writes correct production code on the first try&rdquo;
        or &ldquo;produces a starting point a developer can review in 10
        minutes,&rdquo; and the gap between those is enormous.
      </p>

      <h2>The questions to ask</h2>

      <h3>1. What&rsquo;s the sample size?</h3>
      <p>
        &ldquo;I tried it three times and it worked&rdquo; is essentially no
        evidence about a stochastic system. &ldquo;We benchmarked across 500
        examples&rdquo; is much stronger. &ldquo;I&rsquo;ve been using it for six
        months across many tasks&rdquo; sounds impressive but is hard to interpret
        — selection bias means people remember the wins and forget the losses.
      </p>

      <h3>2. How was &ldquo;good&rdquo; measured?</h3>
      <p>
        &ldquo;The output looked good&rdquo; (judged by who?) is far weaker than a
        measurable outcome. &ldquo;Passed unit tests,&rdquo; &ldquo;matched the
        expert&rsquo;s answer on 80% of cases,&rdquo; &ldquo;reduced average
        handling time by 12% in a controlled rollout&rdquo; are real measurements.
        &ldquo;Users loved it&rdquo; without a baseline is not.
      </p>

      <h3>3. Compared to what?</h3>
      <p>
        Good <em>compared to nothing</em>? Good <em>compared to last year&rsquo;s
        model</em>? Good <em>compared to a junior employee doing the same
        task</em>? Good <em>compared to a search engine plus 10 minutes of
        reading</em>? These are wildly different claims.
      </p>

      <h3>4. How generalizable is the example?</h3>
      <p>
        &ldquo;We had it summarize one earnings call and it was great&rdquo; does
        not generalize to &ldquo;LLMs are good at summarizing earnings calls.&rdquo;
        The single example might have been easy, or your evaluator might have been
        lenient, or the model might have hit a topic well-represented in its
        training. The next earnings call could be a different distribution.
      </p>

      <h3>5. Who&rsquo;s saying it, and what do they get if you believe them?</h3>
      <p>
        Not an ad hominem — a calibration. A vendor selling an LLM product has
        every incentive to present favorable cases. A team that built an internal
        tool has incentive to justify their work. A user-experience study from an
        outside party with a published methodology is differently weighted.
      </p>

      <h2>A worked example</h2>
      <blockquote>
        &ldquo;Our team is now 40% more productive thanks to AI coding assistance.&rdquo;
      </blockquote>
      <p>Read this critically:</p>
      <ul>
        <li><strong>Sample size:</strong> How many engineers, over how many weeks? Was the &ldquo;40%&rdquo; measured or self-reported?</li>
        <li><strong>Measured how:</strong> Lines of code? Closed tickets? Time-to-PR? Engineer-reported feeling? These are wildly different metrics, with different validity.</li>
        <li><strong>Compared to what:</strong> Compared to the same team six months ago, with no other changes? Or compared to a different team? Or compared to no baseline at all?</li>
        <li><strong>Generalizability:</strong> Productivity on what kinds of work — feature work, refactors, bug fixes, prototypes? AI tools help differently across these.</li>
        <li><strong>Source:</strong> An engineering blog post from the AI tool&rsquo;s vendor — different weight than a peer-reviewed study.</li>
      </ul>
      <p>
        After this read, the claim isn&rsquo;t necessarily wrong — but it has
        collapsed from a confident headline number to a vague hypothesis that
        merits further investigation before you build a strategy around it.
      </p>

      <h2>What good claims look like</h2>
      <p>
        Strong claims about LLM performance look like:
      </p>
      <ul>
        <li>
          &ldquo;On the [specific benchmark] across [N] examples, our model scored
          [X] versus baseline [Y], measured by [external metric]. The benchmark
          has known limitations: [list]. Performance on real-world data may
          differ because [reasons].&rdquo;
        </li>
      </ul>
      <p>
        Weak claims look like:
      </p>
      <ul>
        <li>&ldquo;Our AI is amazing at [task].&rdquo;</li>
        <li>&ldquo;LLMs have transformed how we [activity].&rdquo;</li>
        <li>&ldquo;Anyone can now do [hard thing] thanks to AI.&rdquo;</li>
      </ul>
      <p>
        Weak claims are not lies. They might be true. But they aren&rsquo;t
        evidence, and you shouldn&rsquo;t weight them like evidence.
      </p>

      <MultipleChoice
        exerciseId="llm-literacy/10/quiz-1"
        prompt={
          <>
            A LinkedIn post you see: &ldquo;I asked the AI to write my legal brief
            and it was better than any junior associate. AI is genuinely
            transforming our profession.&rdquo; What&rsquo;s the most defensible
            response?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'They are an attorney; their assessment of legal work is authoritative.',
            rationale:
              'Domain expertise helps but does not address sample size, measurement, comparison group, or how generalizable a single example is.',
          },
          {
            id: 'b',
            text: 'One example with a vague comparison is not evidence; the claim might be true but should not change my belief much.',
            correct: true,
            rationale:
              'Right. A single example is weak signal regardless of who reports it. The "transformation" claim leans on an n=1 anecdote.',
          },
          {
            id: 'c',
            text: 'If they liked it, that is what matters — LLMs are tools, not arbiters.',
            rationale:
              'Reframes the question but does not engage the actual claim about quality and transformation.',
          },
          {
            id: 'd',
            text: 'Probably true — AI is widely reported to be good at this kind of writing.',
            rationale:
              '"Widely reported" is exactly the kind of cumulative anecdote that should make you more skeptical, not less.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-literacy/10/quiz-2"
        multi
        prompt={
          <>
            Select <em>all</em> the questions you would ask before believing a
            claim of the form &ldquo;our AI tool improves task X by N%.&rdquo;
          </>
        }
        options={[
          { id: 'a', text: 'How was N measured? On how many examples?', correct: true, rationale: 'Yes — both the metric and the sample matter.' },
          { id: 'b', text: 'What was the baseline being compared against?', correct: true, rationale: "Yes — N% relative to what?" },
          { id: 'c', text: 'Is the AI from a reputable company?', rationale: 'Mildly relevant but does not validate the claim. Reputable companies make weak claims about their own products all the time.' },
          { id: 'd', text: 'Who benefits if I believe the claim?', correct: true, rationale: 'Yes — not a knockout question but a real calibration.' },
          { id: 'e', text: 'Does the result generalize to my work, or just the demoed task?', correct: true, rationale: 'Yes — this is one of the biggest gaps in most vendor claims.' },
          { id: 'f', text: 'Did the demo look impressive?', rationale: 'Demos are designed to look impressive. Demo-quality is weakly correlated with real-world performance.' },
        ]}
      />

      <Reflection
        exerciseId="llm-literacy/10/reflection"
        prompt={
          <>
            Find one &ldquo;LLMs are good at X&rdquo; claim you&rsquo;ve seen
            recently — vendor pitch, blog post, internal announcement. Walk
            through the five questions above. What would have to be true for the
            claim to be load-bearing?
          </>
        }
        modelAnswer={
          <>
            <p>
              Most claims in this category collapse when you press on sample size
              and measurement. The honest version usually looks like: &ldquo;On a
              small number of examples, judged subjectively by the people
              building or buying the system, the output looked reasonable.&rdquo;
              That&rsquo;s not nothing — it&rsquo;s a hypothesis worth
              investigating — but it is not the basis for an organizational
              strategy.
            </p>
            <p>
              The discipline is to neither dismiss the claim nor accept it, but
              to convert it into a question you could actually answer:
              &ldquo;Does this work for <em>our</em> task, measured how, on what
              sample size?&rdquo;
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: where LLMs reliably help — a short, honest list.
      </p>
    </LessonShell>
  );
}
