import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Prompting — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('ai', '07-prompting');
  return (
    <LessonShell
      lessonId="ai/07-prompting"
      trackLabel="AI & Deep Learning"
      trackHref="/tracks/ai"
      title="Prompting"
      estMinutes={12}
      nav={nav}
    >
      <p>
        This lesson covers prompting from a builder&rsquo;s perspective — when
        you&rsquo;re designing a prompt that will run many times in production,
        not chatting with a model. The principles overlap with the LLM
        Literacy track but the focus is structural.
      </p>

      <h2>The anatomy of a robust prompt</h2>
      <p>
        A well-engineered system prompt typically contains:
      </p>
      <ol>
        <li>
          <strong>Role / context.</strong> One or two sentences describing
          what the system is doing. Keep this short. Long role-play preambles
          rarely help.
        </li>
        <li>
          <strong>Task description.</strong> What input you&rsquo;re giving,
          what output you want. Be specific.
        </li>
        <li>
          <strong>Constraints.</strong> What the output must look like, what
          it must avoid. Specific is better than aspirational
          (&ldquo;between 50 and 100 words&rdquo; beats &ldquo;keep it
          short&rdquo;).
        </li>
        <li>
          <strong>Few-shot examples.</strong> 2–5 worked examples of input →
          output. This is one of the highest-leverage moves available.
        </li>
        <li>
          <strong>Output format spec.</strong> If you need structured output
          (JSON, specific sections), describe the schema explicitly. Show an
          example.
        </li>
        <li>
          <strong>The actual input.</strong>
        </li>
      </ol>

      <h2>Structured output</h2>
      <p>
        If your downstream code parses the model&rsquo;s output, ask for a
        specific structure. JSON is the standard. Two ways to make this
        reliable:
      </p>
      <ul>
        <li>
          <strong>Describe the schema</strong> in the prompt and show one
          example. Works for most modern models on simple schemas.
        </li>
        <li>
          <strong>Use the provider&rsquo;s structured-output mode</strong>{' '}
          (OpenAI, Anthropic, and others now have one). Constrains decoding
          so the output is guaranteed to match a JSON schema. Use this when
          available — it eliminates parse failures.
        </li>
      </ul>

      <h2>Few-shot examples — the format that works</h2>
      <pre><code>{`Task: classify the sentiment of a movie review as positive, negative, or mixed.

Example 1:
Review: "The acting was great but the pacing dragged in the middle."
Sentiment: mixed

Example 2:
Review: "An absolute mess. Avoid."
Sentiment: negative

Example 3:
Review: "One of the best I've seen this year."
Sentiment: positive

Now classify:
Review: "<INPUT>"
Sentiment:`}</code></pre>
      <p>
        Notice the labels are short and consistent across examples, the
        format is the same each time, and the model&rsquo;s job is just to
        complete the last line. This shape works far better than free-form
        instructions for many tasks.
      </p>

      <h2>What doesn&rsquo;t reliably help</h2>
      <p>
        Same list as in the LLM Literacy track but worth repeating because
        builders are even more prone to these:
      </p>
      <ul>
        <li>Elaborate role-play preambles. Save the tokens.</li>
        <li>Threats or tips. Folk technique with weak evidence.</li>
        <li>&ldquo;Think step by step&rdquo; on modern models — mostly redundant.</li>
        <li>Overlong prompts. Past a point, more instructions confuse rather than help.</li>
        <li>Vague positive instructions (&ldquo;be thoughtful&rdquo;, &ldquo;be careful&rdquo;).</li>
      </ul>

      <h2>Measuring prompt quality</h2>
      <p>
        A prompt is a piece of code. Like any code, you should measure it.
        Build a small eval set of, say, 50–200 inputs with known correct
        outputs (or human-graded outputs). Run candidate prompts against the
        eval set. Iterate.
      </p>
      <p>
        Two specific patterns worth knowing:
      </p>
      <ul>
        <li>
          <strong>Pairwise comparison</strong> — for outputs where there&rsquo;s
          no single &ldquo;right answer&rdquo; (e.g., summaries, creative
          drafts), show outputs from two prompts side by side and pick which
          you prefer. Repeat across many examples.
        </li>
        <li>
          <strong>Programmatic checks</strong> — for structured tasks, write
          assertions: &ldquo;output must be valid JSON,&rdquo; &ldquo;output
          must include all listed fields,&rdquo; &ldquo;output must not contain
          PII.&rdquo; Run all candidate prompts through them.
        </li>
      </ul>

      <h2>System vs. user prompts</h2>
      <p>
        Chat-style APIs distinguish a <em>system prompt</em> (instructions to
        the model, often invisible to the end user) from <em>user messages</em>{' '}
        (what the user types). Put your task description, constraints, and
        few-shot examples in the system prompt. Put just the actual input in
        the user message. This separation is useful both for organization and
        for cost — repeated system prompts can often be cached by the
        provider.
      </p>

      <MultipleChoice
        exerciseId="ai/07/quiz"
        prompt={<>You need structured JSON output from an LLM at scale. Best approach?</>}
        options={[
          { id: 'a', text: 'Use the provider\'s structured-output / JSON-schema mode if available.', correct: true, rationale: 'Right. Constraining decoding to a schema eliminates parse failures and is the most reliable approach for production.' },
          { id: 'b', text: 'Just say "respond in JSON" and parse the output.', rationale: 'Works most of the time, fails sometimes, and you need to handle the failures gracefully. Use structured-output mode when available.' },
          { id: 'c', text: 'Use regex to extract JSON from the response.', rationale: 'A workaround for unreliable JSON output, but fragile. If you can constrain the output at the source, do that.' },
          { id: 'd', text: 'Fine-tune the model to output JSON.', rationale: 'Massive overkill. Structured-output mode or prompt-level instructions solve this without fine-tuning.' },
        ]}
      />

      <Reflection
        exerciseId="ai/07/reflection"
        prompt={
          <>
            Pick a prompt you&rsquo;ve written for a production task (or
            imagine one). What would your minimal eval set look like? What
            measurable criterion would tell you a new version is better than
            the current one?
          </>
        }
        modelAnswer={
          <>
            <p>
              Without an eval, &ldquo;the new prompt is better&rdquo; is a
              feeling, not a measurement. The minimum useful eval is usually
              20–50 hand-picked inputs covering the cases you care about
              (typical, edge, and adversarial), with a way to mark each output
              as right or wrong. Even this small a set will catch regressions
              that &ldquo;tried it once, looked fine&rdquo; misses.
            </p>
          </>
        }
      />
    </LessonShell>
  );
}
