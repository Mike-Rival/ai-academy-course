import LessonShell from '@/components/LessonShell';
import { Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = {
  title: 'Writing With an LLM Without Losing Your Voice — AI Academy',
};

export default function Page() {
  const nav = getLessonNav('llm-workflows', '04-writing-workflows');
  return (
    <LessonShell
      lessonId="llm-workflows/04-writing-workflows"
      trackLabel="Getting Work Done with LLMs"
      trackHref="/tracks/llm-workflows"
      title="Writing With an LLM Without Losing Your Voice"
      estMinutes={14}
      nav={nav}
    >
      <p>
        Drafting is the first thing most people use an LLM for and the use
        with the least obvious failure mode. The draft is fine. It is
        grammatical, organized, polite. You tidy a few sentences and send it.
        Six months later every email, report, and update you write reads the
        same way, and so does everyone else&rsquo;s, and nobody can tell which
        of your claims you actually checked.
      </p>
      <p>
        This lesson is a writing workflow that keeps the speed and avoids
        that outcome. The key move is to change what you ask the model to
        do: less drafting, more critiquing.
      </p>

      <h2>The accept-without-reading trap</h2>
      <p>
        Here is how it happens. You ask for a draft of a project update.
        The model writes four paragraphs. You read it the way you read
        something you already believe: quickly, for tone, nodding along. It
        says the migration is &ldquo;on track for the end of the
        quarter.&rdquo; You did not tell it that; it inferred it from the
        optimistic framing of your notes. You send it. Now you have made a
        commitment you never consciously made, in writing, to your manager.
      </p>
      <p>
        The trap has two parts. First, a draft you did not write is a draft
        you do not know the contents of, and fluent prose is hard to read
        critically. Second, the model fills gaps with plausible defaults, and
        plausible defaults in a status update are usually reassuring. Neither
        part is a bug. Both are what the tool is built to do.
      </p>

      <h2>Outline, draft, critique, edit</h2>
      <p>
        The workflow splits writing into four steps and gives the model a
        different role in each.
      </p>

      <h3>1. Outline (you, with the model as a sounding board)</h3>
      <p>
        Write the outline yourself: three to six bullet points stating what
        the piece needs to say, in your words, including the specific facts
        and numbers. This is the judgment step from Lesson 1. It is where
        you decide what the update claims. If you want help, ask the model
        &ldquo;what would a skeptical reader of this update want to know that
        I have not listed?&rdquo; and treat the answer as a list of
        candidates to accept or reject.
      </p>

      <h3>2. Draft (the model, from your outline)</h3>
      <p>
        Now ask for a draft, with constraints: &ldquo;Expand this outline into
        a 200-word update. Use only the facts in the outline. Do not add
        claims about timing, status, or confidence that are not in the
        outline. Where the outline is silent, leave a bracketed placeholder
        like [confirm date].&rdquo; The last instruction is the one that
        matters. It converts gap-filling into visible placeholders.
      </p>

      <h3>3. Critique (the model, against your draft)</h3>
      <p>
        This is the step most people skip and the one with the best
        return. Take the draft, whether the model wrote it or you did, and
        ask for criticism rather than improvement:
      </p>
      <pre><code>{`Here is a draft update. Do not rewrite it. Instead, list:
1. Every factual claim it makes, as a numbered list.
2. Any claim that is not supported by the outline below.
3. The two sentences a skeptical reader is most likely to
   push back on, and why.
4. Anything that reads as a commitment or a promise.`}</code></pre>
      <p>
        Item 1 is a verification hook: a list of claims is something you can
        check against what you know in a minute. Item 2 catches the
        gap-filling. Item 4 catches the accidental commitment. None of these
        require you to trust the model&rsquo;s judgment about quality. They
        ask it to enumerate, which it does well, and leave the deciding to
        you.
      </p>
      <p>
        One caution: a critique is also model output. It will sometimes flag
        a non-problem or miss a real one. Treat it as a checklist of things
        to look at, not a verdict on the draft.
      </p>

      <h3>4. Edit (you)</h3>
      <p>
        Now read the draft properly, with the claim list beside it. Fix what
        the critique found. Then make it sound like you: cut the sentence you
        would never say out loud, put back the blunt phrasing the model
        softened. This step is not optional polish. It is where the piece
        becomes something you can stand behind.
      </p>

      <h2>Keeping your voice</h2>
      <p>
        Voice drifts because the model&rsquo;s defaults are stronger than
        your intentions. A few practical defenses:
      </p>
      <ul>
        <li><strong>Give it examples of you.</strong> Two or three paragraphs you wrote and liked, pasted in with &ldquo;match this register,&rdquo; move the output closer to yours than any description of your style will. This is the few-shot technique from the prompting hygiene lesson, applied to tone.</li>
        <li><strong>Draft the sensitive sentence yourself.</strong> The apology, the pushback, the bad news. Let the model handle the paragraphs around it.</li>
        <li><strong>Read it aloud before sending.</strong> A sentence that is hard to say is a sentence you did not write. Low-tech and reliable.</li>
        <li><strong>Watch for the tells.</strong> Each model has habits: a favorite transition word, a tendency to end with an upbeat summary, a fondness for lists of three. Once you notice yours, you can cut them on sight.</li>
      </ul>

      <h2>When to skip the model entirely</h2>
      <p>
        A short message to someone you know well is usually faster to write
        than to prompt, critique, and edit. A message where the exact wording
        carries weight, such as a performance conversation or a reply to an
        upset customer, is one where the gap-filling risk is highest and the
        cost of a wrong default is real. The workflow above is for the
        writing that is long enough to benefit from a drafting step and
        important enough to deserve a critique step. For the rest, just
        write it.
      </p>

      <blockquote>
        <strong>Use the model to list what your draft claims and where it
        overreaches. Keep the outline, the judgment, and the final read for
        yourself.</strong>
      </blockquote>

      <Reflection
        exerciseId="llm-workflows/04/reflection-1"
        prompt={
          <>
            Think of the last piece of writing you sent that an LLM drafted.
            Honestly: did you read it in full, or for tone? List one claim it
            made that you did not explicitly provide. If you cannot remember
            the contents well enough to answer, what does that tell you?
          </>
        }
        modelAnswer={
          <>
            <p>
              Most people cannot answer the second question, and that is the
              finding. If you do not know what the draft claimed, you did not
              verify it, and whatever it said is now something you said.
            </p>
            <p>
              The fix is not to stop using drafts. It is the critique step:
              asking the model to enumerate every claim before you send. A
              list of eight claims takes a minute to read and turns
              &ldquo;skimmed for tone&rdquo; into &ldquo;checked the
              content.&rdquo; The outline step helps too, since claims that
              were never in your outline stand out immediately.
            </p>
          </>
        }
      />

      <Reflection
        exerciseId="llm-workflows/04/reflection-2"
        prompt={
          <>
            Write a critique prompt for one kind of writing you do regularly
            (a weekly update, a customer reply, a proposal section). It should
            ask the model to enumerate, flag, or list, not to rewrite. What
            are the two or three things you most need it to surface for that
            kind of writing?
          </>
        }
        modelAnswer={
          <>
            <p>
              For a customer reply, a defensible version:
            </p>
            <pre><code>{`Do not rewrite this reply. List:
1. Every promise or commitment it makes to the customer,
   including implied ones ("we'll look into it").
2. Any statement about our policy or product that I should
   confirm before sending.
3. Any sentence that could read as blaming the customer.`}</code></pre>
            <p>
              The pattern: each item targets a specific cost. Commitments cost
              you later. Policy claims cost you if wrong. Tone costs you the
              customer. A critique prompt is a checklist aimed at the errors
              that matter for this kind of writing, and the model does the
              enumerating so you can do the deciding.
            </p>
          </>
        }
      />

      <p className="text-sm text-slate-500 mt-8">
        Up next: research with web-enabled and deep-research modes, and why
        the citation trap gets worse, not better, when the model can browse.
      </p>
    </LessonShell>
  );
}
