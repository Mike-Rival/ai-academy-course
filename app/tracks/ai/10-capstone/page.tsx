import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'AI Capstone — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('ai', '10-capstone');
  return (
    <LessonShell
      lessonId="ai/10-capstone"
      trackLabel="AI & Deep Learning"
      trackHref="/tracks/ai"
      title="Capstone: A Tiny QA System"
      estMinutes={30}
      nav={nav}
    >
      <p>
        We&rsquo;ll combine retrieval (Lesson 8), a token-overlap evaluation
        metric (Lesson 9), and a simple &ldquo;answer extraction&rdquo; step
        to build a miniature question-answering pipeline. No real LLM —
        Pyodide can&rsquo;t host one — but every move is the same as in a
        production RAG system.
      </p>

      <h2>The setup</h2>
      <p>
        A small knowledge base about Credence-style topics, plus a set of test
        questions with reference answers. You&rsquo;ll:
      </p>
      <ol>
        <li>Retrieve the most relevant passage for each question.</li>
        <li>Use the retrieved passage as the &ldquo;answer.&rdquo;</li>
        <li>Score each answer against the reference with token-overlap F1.</li>
        <li>Report a mean F1 across the test set.</li>
      </ol>

      <CodeExercise
        exerciseId="ai/10/capstone"
        packages={['scikit-learn']}
        prompt={
          <>
            Wire it together. Compute the mean token-F1 across the four
            questions. Store it in <code>mean_f1</code>. Aim for &gt; 0.3 (this
            is a deliberately simple baseline — a real system would
            extract a focused answer span rather than returning the whole
            passage).
          </>
        }
        starterCode={`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

passages = [
    "Tokenization is the process of breaking text into smaller units called tokens. Modern LLMs use subword tokenization.",
    "Embeddings are dense vectors that represent tokens or text. Similar texts have similar embeddings.",
    "Attention lets a model weight different parts of its input when producing each output. It is the core mechanism of transformers.",
    "Retrieval-augmented generation combines a search step with a language model. Documents relevant to the query are retrieved and added to the prompt.",
    "Fine-tuning continues training a pretrained model on task-specific data. It is good for style and format consistency but rarely the right way to inject new facts.",
]

questions = [
    "What is tokenization?",
    "How do embeddings represent meaning?",
    "What does attention do in a transformer?",
    "What is RAG?",
]

references = [
    "breaking text into smaller units called tokens",
    "similar texts have similar embeddings",
    "lets a model weight different parts of its input",
    "combines a search step with a language model",
]

def token_f1(reference, prediction):
    ref_tokens = reference.split()
    pred_tokens = prediction.split()
    if not ref_tokens or not pred_tokens:
        return 0
    overlap = len(set(ref_tokens) & set(pred_tokens))
    if overlap == 0:
        return 0
    p = overlap / len(pred_tokens)
    r = overlap / len(ref_tokens)
    return 2 * p * r / (p + r)

# Build TF-IDF index over passages
vec = TfidfVectorizer().fit(passages + questions)
passage_vecs = vec.transform(passages)

scores = []
for q, ref in zip(questions, references):
    # 1. retrieve the top-1 passage for the question
    # 2. score the retrieved passage against the reference with token_f1
    # 3. append to scores
    pass

mean_f1 = 0  # replace with mean of scores

print("per-question:", scores)
print("mean_f1:", mean_f1)
`}
        tests={[
          { name: 'mean_f1 > 0.3', code: 'assert mean_f1 > 0.3, f"got {mean_f1}"' },
          { name: 'scores has 4 entries', code: 'assert len(scores) == 4' },
        ]}
        hint={
          <>
            For each question: <code>q_vec = vec.transform([q])</code>;{' '}
            <code>sims = cosine_similarity(q_vec, passage_vecs)[0]</code>;{' '}
            <code>top = passages[sims.argmax()]</code>; then{' '}
            <code>scores.append(token_f1(ref, top))</code>.
          </>
        }
        solution={`# (imports and data setup as above)

scores = []
for q, ref in zip(questions, references):
    q_vec = vec.transform([q])
    sims = cosine_similarity(q_vec, passage_vecs)[0]
    top = passages[sims.argmax()]
    scores.append(token_f1(ref, top))

mean_f1 = sum(scores) / len(scores)

print("per-question:", scores)
print("mean_f1:", mean_f1)
`}
      />

      <h2>What you just built</h2>
      <p>
        The exact same structure as a production RAG-QA system:
      </p>
      <ul>
        <li>Index documents (here: TF-IDF; in prod: sentence embeddings in a vector DB).</li>
        <li>Retrieve at query time.</li>
        <li>Produce an answer (here: return the passage; in prod: feed retrieved passages to an LLM that produces a focused answer).</li>
        <li>Evaluate against held-out reference answers with a measurable metric.</li>
      </ul>

      <h2>The differences in a real system</h2>
      <ul>
        <li>
          <strong>Embeddings instead of TF-IDF.</strong> Better at semantic
          similarity, but harder to debug and not always strictly better.
        </li>
        <li>
          <strong>An LLM in the generate step.</strong> Produces focused
          answers instead of dumping the whole passage, but introduces
          hallucination risk.
        </li>
        <li>
          <strong>Chunking strategies.</strong> Real documents are long;
          chunking choices (size, overlap, where to split) have big effects.
        </li>
        <li>
          <strong>Hybrid retrieval.</strong> Combine semantic (embeddings)
          with lexical (BM25 or TF-IDF) — often better than either alone.
        </li>
        <li>
          <strong>Re-ranking.</strong> Use a smaller, focused model to
          re-rank the top-k retrievals before generation.
        </li>
        <li>
          <strong>Real evaluation.</strong> Multiple metrics, held-out test
          sets, slice analysis, regression testing on every change.
        </li>
      </ul>

      <h2>You&rsquo;re done with this track</h2>
      <p>
        You&rsquo;ve built the core pieces of a modern AI system from the
        ground up: tokens, embeddings, attention, the transformer skeleton,
        retrieval, evaluation. The pieces are now familiar; the rest of any
        AI engineering work is variations on these themes.
      </p>
      <p>
        If you haven&rsquo;t done the LLM Literacy track yet, do that next —
        the workplace usefulness compounds when you understand both how
        these systems work <em>and</em> when not to trust them.
      </p>
    </LessonShell>
  );
}
