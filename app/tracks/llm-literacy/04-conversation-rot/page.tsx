import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Conversation Rot — AI Academy' };

export default function Page() {
  const nav = getLessonNav('llm-literacy', '04-conversation-rot');
  return (
    <LessonShell
      lessonId="llm-literacy/04-conversation-rot"
      trackLabel="Working with LLMs"
      trackHref="/tracks/llm-literacy"
      title="Conversation Rot"
      estMinutes={10}
      nav={nav}
    >
      <p>
        Long conversations get worse, not better. Here&rsquo;s why, and what to do
        about it.
      </p>

      <h2>How the model &ldquo;remembers&rdquo; a conversation</h2>
      <p>
        When you reply to an LLM, the model doesn&rsquo;t recall the conversation
        from memory. The entire conversation history is sent back to the model on
        every turn — your previous messages, its previous responses, everything. The
        model then generates the next response conditioned on that whole transcript.
      </p>
      <p>
        This has two consequences:
      </p>
      <ol>
        <li>
          <strong>The transcript grows.</strong> Eventually it hits a length limit
          (the &ldquo;context window&rdquo;). Different products handle this
          differently — some truncate the oldest messages, some summarize them.
          Either way, information you typed earlier can silently stop being
          available.
        </li>
        <li>
          <strong>The model attends to recent tokens more reliably.</strong> Even
          before the limit, attention isn&rsquo;t uniform across the transcript. A
          rule or constraint you set in message one is easier for the model to
          &ldquo;forget&rdquo; by message twenty than the thing you just said in
          message nineteen.
        </li>
      </ol>

      <h2>What this looks like in practice</h2>
      <ul>
        <li>
          The model contradicts a rule you set up front. (&ldquo;Don&rsquo;t use
          markdown&rdquo; → still using markdown ten turns later.)
        </li>
        <li>
          The model loses track of a piece of context. (&ldquo;The customer is
          enterprise tier&rdquo; → suggesting consumer-tier solutions.)
        </li>
        <li>
          The model drifts in tone or style. (Casual at first, then progressively
          more formal, or vice versa, with no instruction to change.)
        </li>
        <li>
          Hallucinations get more elaborate as the conversation reinforces them.
          The model treats its own earlier (wrong) statements as established facts
          and builds on them.
        </li>
      </ul>

      <h2>The self-reinforcing drift problem</h2>
      <p>
        This last one deserves emphasis. If the model says something wrong in
        message three and you don&rsquo;t catch it, in message four it &ldquo;sees&rdquo;
        that wrong claim in the transcript and treats it as the established
        position. By message ten, you have an elaborate, internally consistent
        structure built on a wrong foundation, all in the model&rsquo;s confident
        voice. The further you go, the more expensive it gets to walk back.
      </p>

      <h2>What to do about it</h2>
      <ul>
        <li>
          <strong>Start a new conversation often.</strong> If the task changes, or
          the model is drifting, open a fresh chat with a fresh setup. There is no
          virtue in keeping a long thread alive.
        </li>
        <li>
          <strong>Restate critical constraints periodically.</strong> Don&rsquo;t
          assume rules from message one are still in force.
        </li>
        <li>
          <strong>Catch errors early.</strong> The first time you spot a wrong
          claim, correct it or start over — don&rsquo;t let it become foundational.
        </li>
        <li>
          <strong>For high-stakes outputs, use a fresh chat with a complete prompt</strong>
          {' '}rather than a long back-and-forth. You lose iterative refinement, but
          you also lose drift.
        </li>
      </ul>

      <MultipleChoice
        exerciseId="llm-literacy/04/quiz-1"
        prompt={
          <>
            Your colleague has been refining a draft with an LLM for the last 45
            minutes — about 30 back-and-forth turns. The latest version is &ldquo;not
            quite right&rdquo; in ways they can&rsquo;t pin down. What&rsquo;s the
            most useful suggestion?
          </>
        }
        options={[
          {
            id: 'a',
            text: 'Keep iterating — the model is close, just needs another nudge.',
            rationale:
              'Iterating in a degraded transcript usually compounds drift rather than fixing it.',
          },
          {
            id: 'b',
            text: 'Start a fresh conversation. Paste in the current draft and a clean prompt describing what you want changed.',
            correct: true,
            rationale:
              'Right. Resetting the transcript clears accumulated drift and lets the model attend fully to your actual constraints.',
          },
          {
            id: 'c',
            text: 'Ask the model what is wrong with the current draft.',
            rationale:
              'The model will produce a plausible critique either way. Self-critique in the same conversation is not reliable diagnostic information.',
          },
          {
            id: 'd',
            text: 'Switch to a larger model.',
            rationale:
              'A bigger model in the same long, drifted transcript will still see all the drift. The problem is the transcript, not the model size.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="llm-literacy/04/quiz-2"
        prompt={
          <>
            True or false: &ldquo;Modern models with large context windows
            don&rsquo;t suffer from conversation rot.&rdquo;
          </>
        }
        options={[
          {
            id: 'a',
            text: 'True — large context windows hold everything, so nothing is lost.',
            rationale:
              'False. The limit is one cause of rot but not the main one. Attention is uneven across the context window; the model still privileges recent tokens.',
          },
          {
            id: 'b',
            text: 'False — having more room for the transcript does not mean the model uses every part of it equally well.',
            correct: true,
            rationale:
              'Correct. Studies show models often lose track of information in the middle of long contexts ("lost in the middle"). Rot is partly about attention, not just capacity.',
          },
          {
            id: 'c',
            text: 'True — bigger models also pay attention more uniformly.',
            rationale:
              'Mostly false. Larger models help on some benchmarks but not reliably enough to make this a safe default.',
          },
          {
            id: 'd',
            text: "Depends — only models with 'reasoning mode' avoid this.",
            rationale: 'Reasoning mode does not fix attention drift in long contexts.',
          },
        ]}
      />

      <Reflection
        exerciseId="llm-literacy/04/reflection"
        prompt={
          <>
            Look at your most recent long LLM conversation (or imagine one). At what
            turn did you stop being sure the model was applying the rules you set up
            front? What signal would have told you to start over?
          </>
        }
        modelAnswer={
          <>
            <p>
              For most people, the honest answer is &ldquo;I never noticed
              it&rdquo; — drift is invisible by design. The model doesn&rsquo;t
              announce &ldquo;I&rsquo;ve stopped applying constraint X.&rdquo; It
              just stops. You only see the symptom (the output feels off) much
              later than the cause.
            </p>
            <p>
              A useful working rule: <strong>if a conversation is past ~20
              substantive turns or the output starts feeling off, start a new one
              with a clean prompt and the current artifact</strong>. The cost is
              cheap; the upside is real.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: the citation trap — what it means when a model cites a source.
      </p>
    </LessonShell>
  );
}
