import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'Tokenization — Credence AI Academy' };

export default function Page() {
  const nav = getLessonNav('ai', '01-tokenization');
  return (
    <LessonShell
      lessonId="ai/01-tokenization"
      trackLabel="AI & Deep Learning"
      trackHref="/tracks/ai"
      title="Tokenization"
      estMinutes={12}
      nav={nav}
    >
      <p>
        Models work on numbers, not text. Before any LLM sees your prompt, it
        has to be cut into pieces (<strong>tokens</strong>) and each piece is
        mapped to an integer ID. That step is tokenization, and it has more
        consequences than most users realize.
      </p>

      <h2>The simplest tokenizer: by word</h2>
      <p>
        &ldquo;The cat sat&rdquo; → <code>[&quot;The&quot;, &quot;cat&quot;,
        &quot;sat&quot;]</code> → say <code>[42, 1097, 6602]</code>. Fine for a
        toy. Fails on: punctuation, unknown words, languages without spaces,
        misspellings, made-up names, emojis.
      </p>

      <h2>What real LLMs do: subword tokenization</h2>
      <p>
        Modern models use <strong>subword</strong> tokenization (BPE,
        WordPiece, or SentencePiece variants). The idea: build a vocabulary of
        common pieces that can combine to form any word. Common words become
        single tokens. Rare words get split into smaller pieces.
      </p>
      <p>
        &ldquo;tokenization&rdquo; might be one token in some vocabularies and
        three in others (&ldquo;token&rdquo;, &ldquo;iz&rdquo;,
        &ldquo;ation&rdquo;). The model never sees the original word — it sees
        the token sequence.
      </p>

      <h2>Why this matters for users</h2>
      <ul>
        <li>
          <strong>Token counts ≠ word counts.</strong> A &ldquo;1000-token&rdquo;
          context window is roughly 600–800 English words; far fewer for code
          or non-English text.
        </li>
        <li>
          <strong>Cost is per token.</strong> API pricing is in tokens. Long
          prompts mean expensive calls.
        </li>
        <li>
          <strong>Unusual text uses more tokens.</strong> Code, math, URLs,
          rare names — each can balloon into many tokens.
        </li>
        <li>
          <strong>Identical strings can tokenize differently in context.</strong>
          &ldquo; the&rdquo; (with leading space) is typically a different
          token than &ldquo;The&rdquo; at the start of a sentence.
        </li>
      </ul>

      <h2>Build a small word-level tokenizer</h2>

      <CodeExercise
        exerciseId="ai/01/word-tokenizer"
        prompt={
          <>
            Write a function <code>tokenize(text, vocab)</code> that splits{' '}
            <code>text</code> on whitespace, looks up each word in{' '}
            <code>vocab</code> (a dict from word → integer), and returns a list
            of IDs. Unknown words should get <code>vocab[&quot;[UNK]&quot;]</code>.
          </>
        }
        starterCode={`vocab = {
    "[UNK]": 0,
    "the": 1,
    "cat": 2,
    "sat": 3,
    "on": 4,
    "mat": 5,
}

def tokenize(text, vocab):
    pass  # replace

print(tokenize("the cat sat on the mat", vocab))
print(tokenize("the cat slept", vocab))
`}
        tests={[
          { name: 'basic sentence', code: 'assert tokenize("the cat sat on the mat", vocab) == [1, 2, 3, 4, 1, 5]' },
          { name: 'unknown word maps to [UNK]', code: 'assert tokenize("the cat slept", vocab) == [1, 2, 0]' },
        ]}
        hint={<>For each word in <code>text.split()</code>, use <code>vocab.get(word, vocab[&quot;[UNK]&quot;])</code>.</>}
        solution={`vocab = {"[UNK]": 0, "the": 1, "cat": 2, "sat": 3, "on": 4, "mat": 5}

def tokenize(text, vocab):
    return [vocab.get(w, vocab["[UNK]"]) for w in text.split()]

print(tokenize("the cat sat on the mat", vocab))
print(tokenize("the cat slept", vocab))
`}
      />

      <h2>Build a tiny BPE-style merger</h2>
      <p>
        The core idea of byte-pair encoding: start with single characters,
        repeatedly merge the most-frequent adjacent pair into a single new
        token. This is a sketch of the algorithm, not a full implementation.
      </p>

      <CodeExercise
        exerciseId="ai/01/bpe-merge"
        prompt={
          <>
            Given a list of token-pair counts, return the single most frequent
            pair. Ties broken alphabetically (smaller first item wins).
          </>
        }
        starterCode={`def most_common_pair(counts):
    """counts: dict like {('l', 'o'): 5, ('h', 'e'): 3, ...}.
       Return the (a, b) pair with the highest count."""
    pass

print(most_common_pair({("l","o"): 5, ("h","e"): 3, ("l","l"): 5}))
`}
        tests={[
          { name: 'picks max', code: 'assert most_common_pair({("a","b"): 2, ("c","d"): 5}) == ("c", "d")' },
          { name: 'ties broken alphabetically', code: 'r = most_common_pair({("l","o"): 5, ("l","l"): 5})\nassert r == ("l", "l")' },
        ]}
        hint={
          <>
            Find the highest count, collect every pair tied at that count,
            and return the alphabetically smallest one.
          </>
        }
        solution={`def most_common_pair(counts):
    max_count = max(counts.values())
    tied = [p for p, c in counts.items() if c == max_count]
    return sorted(tied)[0]

print(most_common_pair({("l","o"): 5, ("h","e"): 3, ("l","l"): 5}))
`}
      />

      <h2>The downstream consequence</h2>
      <p>
        Once you understand tokenization, three behaviors of LLMs make more
        sense:
      </p>
      <ul>
        <li>
          <strong>The model can&rsquo;t count letters in a word reliably.</strong>{' '}
          The word arrives as a token; the model doesn&rsquo;t see the letters
          unless they happen to be separate tokens.
        </li>
        <li>
          <strong>The model is bad at arithmetic, especially on big numbers.</strong>{' '}
          Numbers split into tokens unpredictably (&ldquo;1234&rdquo; might be
          one token; &ldquo;1235&rdquo; might be two).
        </li>
        <li>
          <strong>Non-English languages cost more per character.</strong> The
          tokenizer was trained heavily on English; other writing systems often
          use many more tokens per word.
        </li>
      </ul>

      <h2>Recap</h2>
      <ul>
        <li>Text → tokens → integer IDs. Models only ever see the IDs.</li>
        <li>Subword tokenization is the modern default.</li>
        <li>Tokens are not words, not characters, and not predictable per language.</li>
      </ul>
    </LessonShell>
  );
}
