import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'The Transformer — AI Academy' };

export default function Page() {
  const nav = getLessonNav('ai', '04-transformer-architecture');
  return (
    <LessonShell
      lessonId="ai/04-transformer-architecture"
      trackLabel="AI & Deep Learning"
      trackHref="/tracks/ai"
      title="The Transformer"
      estMinutes={18}
      nav={nav}
    >
      <p>
        You have the pieces: tokens, embeddings, attention. Putting them
        together gives you a transformer. This lesson is mostly conceptual —
        we&rsquo;ll trace how an input flows from text to output.
      </p>

      <h2>The flow</h2>
      <ol>
        <li>
          <strong>Tokenize</strong> the input text into integer IDs.
        </li>
        <li>
          <strong>Embed</strong> each ID into a vector. Add a{' '}
          <em>positional</em> embedding (a vector representing the position in
          the sequence) so the model can tell token order.
        </li>
        <li>
          <strong>Run through N transformer blocks</strong> stacked in
          sequence. Each block has the same shape:
          <ul>
            <li>
              Multi-head self-attention: each token attends to other tokens.
            </li>
            <li>
              A two-layer feedforward network applied independently to each
              position.
            </li>
            <li>
              Residual connections and normalization between sub-layers (so
              gradients flow during training).
            </li>
          </ul>
        </li>
        <li>
          <strong>Project to vocabulary</strong>: a final linear layer turns the
          last layer&rsquo;s output into a vector of size <code>vocab_size</code>,
          one number per possible token.
        </li>
        <li>
          <strong>Softmax</strong> over that vector gives a probability
          distribution over the next token. Sample from it (or pick the
          argmax). That&rsquo;s the next token.
        </li>
        <li>
          <strong>Repeat</strong>: append the new token to the input, run
          everything again.
        </li>
      </ol>

      <h2>Three variants</h2>

      <h3>Decoder-only (GPT-style)</h3>
      <p>
        Used in nearly every modern chat LLM. Generates text by predicting one
        token at a time, conditioned on the prompt and everything generated so
        far. Uses <em>causal</em> attention masking — a token at position{' '}
        <em>t</em> can only attend to positions ≤ <em>t</em>, never the future.
      </p>

      <h3>Encoder-only (BERT-style)</h3>
      <p>
        Used for understanding tasks: classification, embeddings, question
        answering against a known passage. Sees the whole input at once with
        bidirectional attention. Doesn&rsquo;t generate text naturally.
      </p>

      <h3>Encoder-decoder (T5-style)</h3>
      <p>
        Two transformer stacks: an encoder processes the input, a decoder
        generates the output, attending to the encoder&rsquo;s output as it
        goes. Used for translation, summarization, structured generation.
      </p>

      <h2>How models &ldquo;know things&rdquo;</h2>
      <p>
        After training on enormous amounts of text, the weights of the
        transformer encode patterns: which tokens tend to follow which, which
        ideas tend to co-occur, which formats correspond to which kinds of
        prompts. There&rsquo;s no database of facts; there are billions of
        parameters whose configuration approximates &ldquo;the next token a
        human would have written.&rdquo;
      </p>
      <p>
        This is why LLMs:
      </p>
      <ul>
        <li>Often get common facts right (lots of training signal).</li>
        <li>Often get rare facts wrong (sparse training signal — hallucination territory).</li>
        <li>Are excellent at pattern-completion (the literal training task).</li>
        <li>Are limited reasoners (reasoning emerges only insofar as it&rsquo;s in the data; it&rsquo;s not architected in).</li>
      </ul>

      <h2>Parameter counts in context</h2>
      <p>
        When you hear &ldquo;the model has X billion parameters,&rdquo; X is
        the total count of learned numbers in the network — all the weights of
        all the attention heads, feedforwards, and embeddings, added up. GPT-2
        had ~1.5B. GPT-3 had 175B. Modern frontier models are larger but the
        exact counts are mostly proprietary.
      </p>
      <p>
        More parameters generally means more capacity — and more compute and
        memory needed to run inference. It does not directly translate to
        &ldquo;smarter&rdquo;; training data quality and method matter at least
        as much.
      </p>

      <MultipleChoice
        exerciseId="ai/04/quiz-1"
        prompt={<>Why does a decoder-only model use a causal attention mask?</>}
        options={[
          {
            id: 'a',
            text: 'To make training faster.',
            rationale:
              'Causal masking is about preventing information leakage during training, not about speed.',
          },
          {
            id: 'b',
            text: 'During training, the model predicts the next token from earlier tokens. If a token could attend to future tokens, it would just look up the answer; the model would not learn to predict.',
            correct: true,
            rationale:
              'Right. Causal masking enforces the autoregressive constraint that makes the next-token prediction objective meaningful.',
          },
          {
            id: 'c',
            text: 'Because the future does not exist yet at inference.',
            rationale:
              'True at inference but not the original reason. The mask is needed primarily during training; at inference there is no future to attend to anyway.',
          },
          {
            id: 'd',
            text: 'It improves accuracy by limiting overfitting.',
            rationale: 'Not directly related to overfitting.',
          },
        ]}
      />

      <MultipleChoice
        exerciseId="ai/04/quiz-2"
        prompt={<>Which best describes how a transformer "knows" something?</>}
        options={[
          {
            id: 'a',
            text: 'It has an internal database of facts it queries.',
            rationale: 'No — there is no database. Knowledge is encoded in the weights of the network.',
          },
          {
            id: 'b',
            text: 'It memorized its training data verbatim.',
            rationale:
              'Partial — some memorization happens, but most knowledge is encoded as patterns, not literal text.',
          },
          {
            id: 'c',
            text: 'Its weights encode statistical patterns from training data; "knowing X" means the weights tend to produce X-shaped continuations in X-shaped contexts.',
            correct: true,
            rationale:
              'Right. This framing also makes clear why "facts the model rarely saw in training" are exactly the ones it gets wrong — there is no separate fact store to fall back on.',
          },
          {
            id: 'd',
            text: 'It looks things up on the internet at inference time.',
            rationale:
              'Some products combine an LLM with search, but the base transformer itself does not. Knowledge that "appears in the model" is from training.',
          },
        ]}
      />

      <Reflection
        exerciseId="ai/04/reflection"
        prompt={
          <>
            Given this architecture, what kinds of tasks should you expect an
            LLM to be reliable at, and what kinds should you expect it to
            struggle with? Be specific.
          </>
        }
        modelAnswer={
          <>
            <p>
              Reliable: pattern completion on common formats (email drafts,
              summary structures, code in widely-used languages, plausible
              continuations of common situations). Common facts encountered
              many times in training.
            </p>
            <p>
              Unreliable: rare facts (long-tail names, specific numbers,
              niche citations). Tasks requiring precise multi-step logical
              chaining. Anything that requires consulting a specific source —
              the model doesn&rsquo;t have one. Tasks requiring up-to-date
              information beyond the training cutoff.
            </p>
            <p>
              The architecture <em>predicts</em> the failure modes. They&rsquo;re
              not bugs of a particular model — they&rsquo;re consequences of
              what a transformer fundamentally is.
            </p>
          </>
        }
      />
    </LessonShell>
  );
}
