import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Attention, Intuitively — AI Academy' };

export default function Page() {
  const nav = getLessonNav('ai', '03-attention');
  return (
    <LessonShell
      lessonId="ai/03-attention"
      trackLabel="AI & Deep Learning"
      trackHref="/tracks/ai"
      title="Attention, Intuitively"
      estMinutes={15}
      nav={nav}
    >
      <p>
        Attention is the mechanism that lets a transformer combine information
        from different positions in a sequence. It&rsquo;s the part of
        &ldquo;Attention Is All You Need&rdquo; — the 2017 paper that defined
        the architecture every modern LLM is built on.
      </p>

      <h2>The intuition</h2>
      <p>
        When the model processes a particular token, it looks at every other
        token in the sequence and decides &ldquo;how much should I pay attention
        to that one when figuring out what to do here?&rdquo; The weights are
        learned, soft (between 0 and 1, summing to 1), and computed on the fly
        based on the tokens themselves.
      </p>

      <h2>Scaled dot-product attention</h2>
      <p>
        The actual mechanism. Given three matrices — queries (Q), keys (K),
        values (V) — derived from the input tokens:
      </p>
      <pre><code>{`scores = Q @ K.T / sqrt(d_k)         # how much each query "matches" each key
weights = softmax(scores, axis=-1)   # normalize each row to sum to 1
output = weights @ V                  # weighted sum of values`}</code></pre>
      <p>
        That&rsquo;s it. Stack many of these &ldquo;heads&rdquo; in parallel
        (multi-head attention), stack many such layers on top of each other,
        and you have a transformer.
      </p>

      <h2>Implement it</h2>

      <CodeExercise
        exerciseId="ai/03/softmax"
        packages={['numpy']}
        prompt={
          <>
            First, implement a numerically stable <code>softmax</code> along
            the last axis of a 2D array. Subtract the row max before exp to
            avoid overflow.
          </>
        }
        starterCode={`import numpy as np

def softmax(x):
    """x: shape (n, m). Apply softmax along the last axis."""
    pass

print(softmax(np.array([[1.0, 2.0, 3.0]])))
print(softmax(np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])).sum(axis=-1))
`}
        tests={[
          { name: 'rows sum to 1', code: 'import numpy as np\nout = softmax(np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]))\nassert np.allclose(out.sum(axis=-1), 1.0)' },
          { name: 'monotonic: largest input has largest output', code: 'import numpy as np\nout = softmax(np.array([[1.0, 2.0, 3.0]]))\nassert np.argmax(out) == 2' },
        ]}
        hint={
          <>
            <code>x_shifted = x - x.max(axis=-1, keepdims=True)</code>;{' '}
            <code>e = np.exp(x_shifted)</code>;{' '}
            <code>return e / e.sum(axis=-1, keepdims=True)</code>.
          </>
        }
        solution={`import numpy as np

def softmax(x):
    x_shifted = x - x.max(axis=-1, keepdims=True)
    e = np.exp(x_shifted)
    return e / e.sum(axis=-1, keepdims=True)

print(softmax(np.array([[1.0, 2.0, 3.0]])))
`}
      />

      <CodeExercise
        exerciseId="ai/03/attention"
        packages={['numpy']}
        prompt={
          <>
            Implement scaled dot-product attention. Inputs are <code>Q</code>{' '}
            (queries), <code>K</code> (keys), <code>V</code> (values), each
            shape <code>(seq_len, d)</code>. Return the output, also{' '}
            <code>(seq_len, d)</code>.
          </>
        }
        starterCode={`import numpy as np

def softmax(x):
    x_shifted = x - x.max(axis=-1, keepdims=True)
    e = np.exp(x_shifted)
    return e / e.sum(axis=-1, keepdims=True)

def attention(Q, K, V):
    pass

# Quick sanity check
np.random.seed(0)
Q = np.random.randn(3, 4)
K = np.random.randn(3, 4)
V = np.random.randn(3, 4)
out = attention(Q, K, V)
print(out.shape)
`}
        tests={[
          { name: 'output shape matches Q', code: 'import numpy as np\nnp.random.seed(0)\nQ=np.random.randn(3,4); K=np.random.randn(3,4); V=np.random.randn(3,4)\nout = attention(Q, K, V)\nassert out.shape == (3, 4)' },
          { name: 'identical Q and K give attention-to-self bias', code: 'import numpy as np\nQ = np.eye(3) * 100\nK = np.eye(3) * 100\nV = np.array([[1.0, 0, 0], [0, 1, 0], [0, 0, 1]])\nout = attention(Q, K, V)\nassert np.allclose(out, V, atol=1e-5)' },
        ]}
        hint={
          <>
            <code>scores = Q @ K.T / np.sqrt(Q.shape[-1])</code>;{' '}
            <code>weights = softmax(scores)</code>;{' '}
            <code>return weights @ V</code>.
          </>
        }
        solution={`import numpy as np

def softmax(x):
    x_shifted = x - x.max(axis=-1, keepdims=True)
    e = np.exp(x_shifted)
    return e / e.sum(axis=-1, keepdims=True)

def attention(Q, K, V):
    d = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d)
    weights = softmax(scores)
    return weights @ V

np.random.seed(0)
Q = np.random.randn(3, 4)
K = np.random.randn(3, 4)
V = np.random.randn(3, 4)
print(attention(Q, K, V))
`}
      />

      <h2>What you just built</h2>
      <p>
        That eight-line function is the heart of every transformer. Real models
        run many such heads in parallel (multi-head attention), stack many
        layers (each layer = attention + a feedforward block), and learn the
        projections that produce Q, K, V from the input. The basic move is
        what you just wrote.
      </p>

      <h2>Why this won</h2>
      <p>
        Before transformers, sequence models (RNNs, LSTMs) processed text one
        token at a time. They couldn&rsquo;t parallelize over sequence
        position, and they struggled to connect distant tokens. Attention lets
        the model look at the whole sequence at once and learn to focus on
        what matters. This both enabled massive parallelism on GPUs and
        produced better long-range modeling — the combination that scaled.
      </p>

      <h2>Recap</h2>
      <ul>
        <li>Attention = weighted average of values, where weights are learned per query-key match.</li>
        <li>The math is short. The architecture wrapping it is what got complex.</li>
        <li>Every modern LLM is variations on this theme.</li>
      </ul>
    </LessonShell>
  );
}
