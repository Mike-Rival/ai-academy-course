import LessonShell from '@/components/LessonShell';
import { MultipleChoice, Reflection } from '@/components/NonCodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Using Pre-trained Models — AI Academy' };

export default function Page() {
  const nav = getLessonNav('ai', '05-using-pretrained');
  return (
    <LessonShell
      lessonId="ai/05-using-pretrained"
      trackLabel="AI & Deep Learning"
      trackHref="/tracks/ai"
      title="Using Pre-trained Models"
      estMinutes={15}
      nav={nav}
    >
      <p>
        You don&rsquo;t train a transformer from scratch unless you are an
        organization with a very particular reason to. For nearly every
        practical task you grab a pretrained model from the Hugging Face Hub or
        an API and use it for inference. This lesson is about the landscape and
        the patterns.
      </p>

      <h2>The categories of pretrained model</h2>

      <h3>1. Hosted LLMs (API)</h3>
      <p>
        Frontier models — Claude, GPT-class, Gemini — accessed via API. You
        pay per token. You don&rsquo;t see the weights. The model handles
        chat-style interaction, function calling, sometimes vision and tool
        use. Highest capability, highest cost, least control over data
        residency.
      </p>

      <h3>2. Open-weights models</h3>
      <p>
        Llama, Mistral, Qwen, DeepSeek, and many smaller models. You can
        download the weights and run them yourself — on your own hardware, on
        a managed-inference provider, or fine-tuned for your task. Lower
        ceiling than the frontier APIs, but full control, no per-token cost,
        and your data stays where you put it.
      </p>

      <h3>3. Task-specific models</h3>
      <p>
        Smaller encoder models trained for one job: sentence embeddings,
        sentiment classification, named-entity recognition, translation.{' '}
        <code>sentence-transformers</code>, BERT-based classifiers, BART for
        summarization. Often dramatically smaller than chat LLMs (millions to
        a few billion parameters), much faster, and good enough for many
        production use cases.
      </p>

      <h3>4. Multimodal models</h3>
      <p>
        Models that understand or generate images, audio, or video alongside
        text. Often paired with an LLM front end.
      </p>

      <h2>Running models in the browser</h2>
      <p>
        Why a Python notebook can&rsquo;t do this in your browser tab:
        Pyodide ships NumPy, Pandas, and scikit-learn — but it does not ship
        PyTorch, which most pretrained models require. There&rsquo;s no
        practical way to run a 7B-parameter PyTorch model in a browser sandbox
        anyway.
      </p>
      <p>
        Two reasonable in-browser options exist:
      </p>
      <ul>
        <li>
          <strong>transformers.js</strong> — a JavaScript port of Hugging
          Face&rsquo;s pipelines using ONNX Runtime under the hood. Runs small
          models (sentence embeddings, sentiment classifiers, tiny LLMs)
          client-side. We&rsquo;ll likely add a transformers.js demo to this
          lesson later.
        </li>
        <li>
          <strong>&ldquo;Open in Colab&rdquo;</strong> — for anything heavier
          (real LLMs, fine-tuning, training), Colab gives you a free GPU.
          We&rsquo;ll provide Colab links for the more demanding exercises.
        </li>
      </ul>

      <h2>The standard pattern: a pipeline</h2>
      <p>
        Hugging Face packages common tasks behind a uniform interface:
      </p>
      <pre><code>{`from transformers import pipeline

# Sentiment analysis
clf = pipeline("sentiment-analysis")
clf("I love this course!")
# → [{'label': 'POSITIVE', 'score': 0.9998}]

# Sentence embeddings
embedder = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")
v = embedder("Hello world")

# Summarization
summ = pipeline("summarization")
summ(long_text)`}</code></pre>
      <p>
        The pipeline downloads the model the first time you use it, then runs
        local inference. Two lines, end to end. (Run this in a Colab notebook,
        not here.)
      </p>

      <h2>Picking the right model</h2>
      <p>
        A few rules of thumb:
      </p>
      <ul>
        <li>
          <strong>Start small.</strong> A sentence-transformer model with
          ~100M parameters often does the embedding job better than a
          conversational LLM does, at 1% of the cost.
        </li>
        <li>
          <strong>Match model to task.</strong> Don&rsquo;t use an LLM as a
          classifier if a fine-tuned BERT-class model is available.
          Don&rsquo;t use a tiny model for an open-ended generation task that
          really does need world knowledge.
        </li>
        <li>
          <strong>Read the model card.</strong> Hugging Face model pages list
          training data, intended use, license, limitations. Most users skip
          this. Read it.
        </li>
        <li>
          <strong>Check the license.</strong> Open weights doesn&rsquo;t mean
          unrestricted commercial use. Llama, Gemma, and others have specific
          terms.
        </li>
        <li>
          <strong>Measure on your data.</strong> Benchmark scores translate
          poorly to specific tasks. Try several candidates on a slice of your
          actual data.
        </li>
      </ul>

      <MultipleChoice
        exerciseId="ai/05/quiz"
        prompt={<>You need to classify support tickets into 12 categories. Which is the most defensible first move?</>}
        options={[
          {
            id: 'a',
            text: 'Call GPT-4 for each ticket, asking it to pick a category.',
            rationale:
              'Will work but is expensive and slow. A trained classifier on tickets is faster, cheaper, and usually more reliable on a closed label set.',
          },
          {
            id: 'b',
            text: 'Fine-tune a Llama-70B on labeled tickets.',
            rationale:
              'Massive overkill for a 12-class classification task. A smaller encoder model is much better suited.',
          },
          {
            id: 'c',
            text: 'Try a small pretrained encoder (DistilBERT-class) plus a classifier head; fine-tune on your labeled tickets.',
            correct: true,
            rationale:
              'Right. Right-sized model, well-suited to the task, cheap to run in production, easy to fine-tune.',
          },
          {
            id: 'd',
            text: 'Train a transformer from scratch on your tickets.',
            rationale:
              "You don't have nearly enough data, and a pretrained model encodes language understanding that a from-scratch model would have to learn the hard way.",
          },
        ]}
      />

      <Reflection
        exerciseId="ai/05/reflection"
        prompt={
          <>
            Think of a task at your work that uses (or could use) AI. Walk
            through the four categories above. Which fits best? Why not the
            others? What would you measure to confirm the choice?
          </>
        }
        modelAnswer={
          <>
            <p>
              The most common mistake in this question is &ldquo;use a frontier
              LLM API because that&rsquo;s what people use.&rdquo; For many
              workplace tasks — classification, ranking, search, embeddings —
              a much smaller task-specific model wins on every axis except
              demo impressiveness.
            </p>
            <p>
              The right test is rarely &ldquo;does it work?&rdquo; — it&rsquo;s
              &ldquo;does it work as well as a 1/100th-the-cost alternative?&rdquo;
              Run that test before committing to the expensive choice.
            </p>
          </>
        }
      />
    </LessonShell>
  );
}
