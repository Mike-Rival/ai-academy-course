import LessonShell from '@/components/LessonShell';
import { Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Capstone: Decide Before You Use — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-literacy', '14-capstone');
  return (
    <LessonShell
      lessonId="llm-literacy/14-capstone"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title="Capstone: Decide Before You Use"
      estMinutes={20}
      nav={nav}
    >
      <p>
        This capstone is not a quiz. It&rsquo;s a structured walk-through you
        apply to a real workplace task. The point is to integrate the framework
        from the previous thirteen lessons into something you can use the next
        time you reach for an AI tool.
      </p>

      <h2>Pick a task</h2>
      <p>
        Pick a task you do (or are considering doing) with help from an AI tool.
        Real, recent, specific. Not &ldquo;writing reports in general&rdquo; —
        pick the next report you have to write. Not &ldquo;our customer support
        process&rdquo; — pick the ticket queue you handle this week.
      </p>
      <p>
        Then walk through the seven prompts below in writing. Use the reflection
        boxes to commit to your answers before reading anyone else&rsquo;s. You
        don&rsquo;t need to share these answers with anyone — they&rsquo;re
        for you.
      </p>

      <h2>1. Describe the task in one paragraph</h2>

      <Reflection
        exerciseId="llm-literacy/14/q1"
        prompt={
          <>
            In two or three sentences, describe the specific task. Include: what
            the input is, what the output is, who consumes the output, and what
            happens if it&rsquo;s wrong.
          </>
        }
        modelAnswer={
          <>
            <p>
              Example: &ldquo;Summarize a 30-page vendor proposal for the
              procurement committee&rsquo;s pre-read. Input: the proposal PDF.
              Output: a one-page brief with pricing, key terms, and
              recommendation. Consumed by procurement leads who use it to decide
              whether to enter contract negotiations. If wrong, we either pursue
              a bad deal or skip a good one — financial impact in the hundreds
              of thousands.&rdquo;
            </p>
            <p>
              The specificity is the point. Vague tasks lead to vague decisions.
            </p>
          </>
        }
      />

      <h2>2. Can the output be verified?</h2>

      <Reflection
        exerciseId="llm-literacy/14/q2"
        prompt={
          <>
            For this specific task: can you, with the time and tools you actually
            have, check the output against ground truth? Fully, partially (with
            a sample), or not at all?
          </>
        }
        modelAnswer={
          <>
            <p>
              The procurement example above: <em>partially</em>. You could
              spot-check pricing against specific pages of the proposal, but
              you can&rsquo;t practically re-read the whole thing in the time
              you have.
            </p>
            <p>
              Honest answers here matter more than aspirational ones.
              &ldquo;I could in principle&rdquo; is not the same as &ldquo;I
              will, this week, for this task.&rdquo;
            </p>
          </>
        }
      />

      <h2>3. What&rsquo;s the cost of being wrong?</h2>

      <Reflection
        exerciseId="llm-literacy/14/q3"
        prompt={
          <>
            Concretely. Not &ldquo;could be bad&rdquo; — what is the worst
            realistic consequence if an LLM error propagates through your task
            unchecked? Who pays the cost?
          </>
        }
        modelAnswer={
          <>
            <p>
              The named cost is the lever. &ldquo;Embarrassment in front of my
              boss&rdquo; is a different decision than &ldquo;regulatory
              exposure&rdquo; or &ldquo;customer harm.&rdquo; Both are valid
              inputs; treating them the same is the failure mode.
            </p>
            <p>
              Watch for cost externalities — costs that fall on someone other
              than you. Those are easy to underweight because you don&rsquo;t
              feel them.
            </p>
          </>
        }
      />

      <h2>4. What&rsquo;s the cheapest credible verification?</h2>

      <Reflection
        exerciseId="llm-literacy/14/q4"
        prompt={
          <>
            What&rsquo;s the cheapest verification step that would actually catch
            the most common error mode? Not the perfect verification — the cheap
            one you would actually do.
          </>
        }
        modelAnswer={
          <>
            <p>
              For the procurement example: spot-check the three or four numbers
              that drive the recommendation — total cost, key SLAs, termination
              terms. These are short, specific, and high-value. Verifying them
              takes ten minutes. The whole-document verification would take
              hours.
            </p>
            <p>
              The principle: pick the verification that maximizes
              (probability-of-catching-error × cost-of-that-error) per minute
              of verification effort.
            </p>
          </>
        }
      />

      <h2>5. Will you actually do that verification?</h2>

      <Reflection
        exerciseId="llm-literacy/14/q5"
        prompt={
          <>
            Honest answer. Under realistic time pressure, in a normal week, will
            you do the verification step you just named — every time? Sometimes?
            Rarely?
          </>
        }
        modelAnswer={
          <>
            <p>
              The honest answer is often &ldquo;sometimes,&rdquo; not always.
              That&rsquo;s real data — it tells you the workflow needs either
              (a) a forcing function so verification happens by default
              (checklist, peer review, gate before sending), or (b) a downgrade
              in your trust of the unverified output.
            </p>
            <p>
              If your answer is &ldquo;rarely,&rdquo; that&rsquo;s a strong
              signal that the AI step shouldn&rsquo;t be load-bearing in this
              workflow.
            </p>
          </>
        }
      />

      <h2>6. Decision</h2>

      <Reflection
        exerciseId="llm-literacy/14/q6"
        prompt={
          <>
            Given the previous five answers: do you use the LLM for this task as
            currently scoped, restructure the task so it falls into a regime you
            can verify, or do it without the LLM?
          </>
        }
        modelAnswer={
          <>
            <p>
              All three answers can be right depending on the task. The point
              is that it&rsquo;s a <em>decision</em> — one you can defend to a
              colleague, your boss, or yourself a year from now if something
              goes wrong.
            </p>
            <p>
              The most common shift in practice is restructuring: instead of
              &ldquo;the LLM does the whole task,&rdquo; the LLM does a
              narrower piece you can verify, and a human does the
              judgment-heavy part. This isn&rsquo;t a fallback — it&rsquo;s
              often the most productive workflow.
            </p>
          </>
        }
      />

      <h2>7. The forcing function</h2>

      <Reflection
        exerciseId="llm-literacy/14/q7"
        prompt={
          <>
            If your decision in Q6 involves using the LLM with verification,
            what&rsquo;s the forcing function that ensures the verification
            happens? &ldquo;I will remember&rdquo; is not a forcing function —
            that&rsquo;s wishful thinking. A checklist, a colleague-review step,
            a gate in the workflow tool, a template that builds it in. What
            specifically?
          </>
        }
        modelAnswer={
          <>
            <p>
              Without a forcing function, well-intentioned verification dies
              under time pressure. The functions that actually work tend to be:
            </p>
            <ul>
              <li>
                A template or checklist that pairs the LLM output with the
                verification step (and won&rsquo;t let you mark the task done
                without doing both).
              </li>
              <li>A peer-review gate before output goes external.</li>
              <li>
                A workflow that physically separates &ldquo;generate&rdquo;
                from &ldquo;send,&rdquo; with a deliberate review step in
                between.
              </li>
            </ul>
            <p>
              The bar to clear: when you&rsquo;re tired, rushed, and stressed,
              will the verification still happen? If not, the forcing function
              isn&rsquo;t strong enough.
            </p>
          </>
        }
      />

      <h2>You&rsquo;ve completed the track</h2>
      <p>
        The track was structured around one idea: the goal isn&rsquo;t to tell
        you when to use AI or when not to. The goal was to give you a framework
        you can apply to your own tasks, with your own risk tolerances and
        verification capacity, so you can make those decisions consciously
        rather than by reflex.
      </p>
      <p>
        If you took one thing from the track: <strong>tone is not evidence,
        and confident ignorance is worse than honest ignorance.</strong> The
        rest is application.
      </p>
      <p>
        From here, if you&rsquo;d like to understand the technical side of how
        these systems actually work — what tokenization, embeddings, attention,
        and transformers really are — the AI &amp; Deep Learning track is the
        next step. If you want to start building your own models, head to the
        ML Basics track. Or just close the tab and use what you learned. That
        works too.
      </p>
    </LessonShell>
  );
}
