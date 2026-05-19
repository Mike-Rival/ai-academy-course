import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Embeddings — AI Academy' };

export default function Page() {
  const nav = getLessonNav('ai', '02-embeddings');
  return (
    <LessonShell
      lessonId="ai/02-embeddings"
      trackLabel="AI & Deep Learning"
      trackHref="/tracks/ai"
      title="Embeddings"
      estMinutes={15}
      nav={nav}
    >
      <p>
        Once text is tokenized into integer IDs, the model needs to turn each
        ID into something it can do math with. That something is an{' '}
        <strong>embedding</strong>: a learned vector of (typically) hundreds or
        thousands of numbers per token.
      </p>

      <h2>Why vectors?</h2>
      <p>
        Integer IDs have no inherent relationship. The integer for
        &ldquo;cat&rdquo; and the integer for &ldquo;kitten&rdquo; are
        arbitrary; their numeric closeness or distance means nothing.
      </p>
      <p>
        Vectors can encode <em>similarity</em>. A model trained well puts
        vectors for related words close together in the embedding space and
        unrelated words far apart. After training, &ldquo;cat&rdquo; and
        &ldquo;kitten&rdquo; might point in nearly the same direction;
        &ldquo;cat&rdquo; and &ldquo;asphalt&rdquo; nowhere near each other.
      </p>

      <h2>Measuring similarity: cosine</h2>
      <p>
        The standard similarity measure is <strong>cosine similarity</strong>:
        the cosine of the angle between two vectors. It ignores magnitude and
        looks only at direction.
      </p>
      <pre><code>{`cos_sim(a, b) = (a · b) / (||a|| · ||b||)`}</code></pre>
      <p>
        Values range from -1 (opposite directions) through 0 (perpendicular —
        unrelated) to +1 (same direction — very similar).
      </p>

      <CodeExercise
        exerciseId="ai/02/cosine"
        packages={['numpy']}
        prompt={
          <>
            Write <code>cosine_similarity(a, b)</code> for two 1D numpy arrays.
            Return a float between -1 and 1.
          </>
        }
        starterCode={`import numpy as np

def cosine_similarity(a, b):
    pass  # replace

print(cosine_similarity(np.array([1, 0]), np.array([1, 0])))   # 1.0
print(cosine_similarity(np.array([1, 0]), np.array([0, 1])))   # 0.0
print(cosine_similarity(np.array([1, 0]), np.array([-1, 0])))  # -1.0
`}
        tests={[
          { name: 'identical vectors → 1', code: 'import numpy as np\nassert abs(cosine_similarity(np.array([1.0, 0.0]), np.array([1.0, 0.0])) - 1.0) < 1e-9' },
          { name: 'orthogonal → 0', code: 'import numpy as np\nassert abs(cosine_similarity(np.array([1.0, 0.0]), np.array([0.0, 1.0]))) < 1e-9' },
          { name: 'opposite → -1', code: 'import numpy as np\nassert abs(cosine_similarity(np.array([1.0, 0.0]), np.array([-1.0, 0.0])) + 1.0) < 1e-9' },
        ]}
        hint={
          <>
            Dot product divided by the product of magnitudes:{' '}
            <code>np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))</code>.
          </>
        }
        solution={`import numpy as np

def cosine_similarity(a, b):
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

print(cosine_similarity(np.array([1, 0]), np.array([1, 0])))
print(cosine_similarity(np.array([1, 0]), np.array([0, 1])))
print(cosine_similarity(np.array([1, 0]), np.array([-1, 0])))
`}
      />

      <h2>Find the most similar item</h2>

      <CodeExercise
        exerciseId="ai/02/most-similar"
        packages={['numpy']}
        prompt={
          <>
            Given a query vector and a matrix of candidate vectors (one per
            row), return the index of the candidate with the highest cosine
            similarity to the query.
          </>
        }
        starterCode={`import numpy as np

def most_similar(query, candidates):
    """query: shape (d,). candidates: shape (n, d). Return int."""
    pass

query = np.array([1.0, 0.0])
candidates = np.array([
    [0.0, 1.0],   # orthogonal
    [0.9, 0.1],   # similar
    [-1.0, 0.0],  # opposite
])
print(most_similar(query, candidates))
`}
        tests={[
          { name: 'picks the closest candidate', code: 'import numpy as np\nq = np.array([1.0, 0.0])\nc = np.array([[0.0, 1.0], [0.9, 0.1], [-1.0, 0.0]])\nassert most_similar(q, c) == 1' },
        ]}
        hint={
          <>
            Compute the dot product of the normalized query with each
            normalized row, then argmax. Or normalize all of them and use a
            single matrix multiplication.
          </>
        }
        solution={`import numpy as np

def most_similar(query, candidates):
    q = query / np.linalg.norm(query)
    c = candidates / np.linalg.norm(candidates, axis=1, keepdims=True)
    sims = c @ q
    return int(np.argmax(sims))

query = np.array([1.0, 0.0])
candidates = np.array([[0.0, 1.0], [0.9, 0.1], [-1.0, 0.0]])
print(most_similar(query, candidates))
`}
      />

      <h2>What embeddings give you</h2>
      <p>
        The vector-similarity trick is the foundation of:
      </p>
      <ul>
        <li>
          <strong>Semantic search</strong>: embed the query and documents in
          the same space, return the closest matches.
        </li>
        <li>
          <strong>RAG (retrieval-augmented generation)</strong>: same as above,
          but feed the retrieved documents into an LLM prompt.
        </li>
        <li>
          <strong>Recommendations</strong>: embed users and items, recommend
          items whose vectors are close to the user&rsquo;s.
        </li>
        <li>
          <strong>Classification</strong>: embed text, train a simple model on
          top of the embeddings.
        </li>
      </ul>

      <h2>An honest caveat</h2>
      <p>
        Embedding similarity is not truth or relevance — it&rsquo;s
        co-occurrence in training data. Two unrelated documents about
        completely different topics can still embed close together if they share
        vocabulary. Semantic search returns &ldquo;documents the model finds
        similar,&rdquo; not &ldquo;documents actually answering the
        question.&rdquo; This is the silent failure mode of RAG we&rsquo;ll
        revisit in Lesson 8.
      </p>

      <h2>Recap</h2>
      <ul>
        <li>Embeddings are learned vectors per token (or per sentence, per document).</li>
        <li>Cosine similarity measures direction-similarity, ignoring magnitude.</li>
        <li>Embedding-based retrieval finds &ldquo;similar&rdquo; — which is not the same as &ldquo;relevant&rdquo; or &ldquo;correct.&rdquo;</li>
      </ul>
    </LessonShell>
  );
}
