import LessonShell from '@/components/LessonShell';
import CodeExercise from '@/components/CodeExercise';
import { getLessonNav } from '@/lib/curriculum';

export const metadata = { title: 'RAG Basics — AI Academy' };

export default function Page() {
  const nav = getLessonNav('ai', '08-rag-basics');
  return (
    <LessonShell
      lessonId="ai/08-rag-basics"
      trackLabel="AI & Deep Learning"
      trackHref="/tracks/ai"
      title="RAG Basics"
      estMinutes={15}
      nav={nav}
    >
      <p>
        RAG — retrieval-augmented generation — pairs an LLM with a search step
        over a document collection. At query time you retrieve the most
        relevant passages and put them in the prompt. The LLM answers based
        on the retrieved context.
      </p>

      <h2>The shape</h2>
      <ol>
        <li><strong>Index</strong> your document collection into something searchable. Usually: chunk each document into passages, embed each chunk into a vector, store vectors with their text.</li>
        <li><strong>Retrieve</strong>: at query time, embed the query, find the top-k most similar chunks by cosine similarity.</li>
        <li><strong>Generate</strong>: stuff the retrieved chunks into the prompt and ask the LLM to answer using them.</li>
      </ol>

      <h2>Build a tiny version</h2>
      <p>
        We&rsquo;ll skip embeddings (Pyodide can&rsquo;t load a real embedding
        model) and use scikit-learn&rsquo;s TF-IDF instead. The retrieval
        mechanics are the same: vectorize, compute similarity, return the
        nearest documents. You&rsquo;d swap TF-IDF for sentence embeddings in
        production.
      </p>

      <CodeExercise
        exerciseId="ai/08/retrieve"
        packages={['scikit-learn']}
        prompt={
          <>
            Given a list of documents and a query, return the top-2 most
            similar documents by TF-IDF cosine similarity. Store the indices
            in <code>top_indices</code>.
          </>
        }
        starterCode={`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

docs = [
    "Cats are small carnivorous mammals often kept as pets.",
    "Python is a programming language known for readability.",
    "Dogs have been companions to humans for thousands of years.",
    "Machine learning is a subset of artificial intelligence.",
    "Cats can purr at frequencies that promote bone healing.",
]
query = "tell me about cats"

vec = TfidfVectorizer().fit(docs + [query])
# transform docs and query, compute similarities

top_indices = None  # list of 2 ints

print("top indices:", top_indices)
for i in top_indices:
    print("-", docs[i])
`}
        tests={[
          { name: 'returns two indices', code: 'assert len(top_indices) == 2' },
          { name: 'first match is a cat doc', code: 'assert top_indices[0] in (0, 4)' },
          { name: 'both matches are cat docs', code: 'assert set(top_indices) == {0, 4}' },
        ]}
        hint={
          <>
            <code>doc_vecs = vec.transform(docs)</code>;{' '}
            <code>q_vec = vec.transform([query])</code>;{' '}
            <code>sims = cosine_similarity(q_vec, doc_vecs)[0]</code>; then{' '}
            <code>top_indices = sims.argsort()[::-1][:2].tolist()</code>.
          </>
        }
        solution={`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

docs = [
    "Cats are small carnivorous mammals often kept as pets.",
    "Python is a programming language known for readability.",
    "Dogs have been companions to humans for thousands of years.",
    "Machine learning is a subset of artificial intelligence.",
    "Cats can purr at frequencies that promote bone healing.",
]
query = "tell me about cats"

vec = TfidfVectorizer().fit(docs + [query])
doc_vecs = vec.transform(docs)
q_vec = vec.transform([query])
sims = cosine_similarity(q_vec, doc_vecs)[0]

top_indices = sims.argsort()[::-1][:2].tolist()

print("top indices:", top_indices)
for i in top_indices:
    print("-", docs[i])
`}
      />

      <h2>Construct a RAG prompt</h2>

      <CodeExercise
        exerciseId="ai/08/prompt"
        prompt={
          <>
            Given a list of retrieved chunks and a user question, build a RAG
            prompt string. Format the chunks as a numbered list, then ask the
            model to answer using only the retrieved information. Store the
            result in <code>prompt</code>.
          </>
        }
        starterCode={`chunks = [
    "Cats are small carnivorous mammals.",
    "Cats can purr at frequencies that promote bone healing.",
]
question = "What is special about how cats purr?"

prompt = ""  # build the prompt

print(prompt)
`}
        tests={[
          { name: 'prompt contains both chunks', code: 'assert "carnivorous" in prompt and "bone healing" in prompt' },
          { name: 'prompt contains the question', code: 'assert "What is special about how cats purr?" in prompt' },
          { name: 'prompt instructs to use only the context', code: 'assert "only" in prompt.lower() or "based on" in prompt.lower()' },
        ]}
        hint={
          <>
            Concatenate a header, the chunks as a numbered list, then the
            instruction (&ldquo;Answer the question using only the information
            in the passages above&rdquo;), then the question.
          </>
        }
        solution={`chunks = [
    "Cats are small carnivorous mammals.",
    "Cats can purr at frequencies that promote bone healing.",
]
question = "What is special about how cats purr?"

context = "\\n".join(f"{i+1}. {c}" for i, c in enumerate(chunks))
prompt = f"""Context passages:
{context}

Answer the question using only the information in the passages above. If the answer is not in the passages, say so.

Question: {question}
Answer:"""

print(prompt)
`}
      />

      <h2>What RAG fixes</h2>
      <ul>
        <li>Grounds answers in specific source material you control.</li>
        <li>Lets you cite passages so users can verify (when they actually click through).</li>
        <li>Handles knowledge that wasn&rsquo;t in the model&rsquo;s training data, or that has changed since.</li>
      </ul>

      <h2>What RAG doesn&rsquo;t fix</h2>
      <ul>
        <li>
          <strong>The model still hallucinates within retrieved context.</strong>{' '}
          Even when the right passage is in the prompt, the model can
          mis-attribute, miss a qualification, or invert a sign. Read the LLM
          Literacy track&rsquo;s &ldquo;citation trap&rdquo; lesson if you
          haven&rsquo;t.
        </li>
        <li>
          <strong>Silent retrieval failures.</strong> When the right passage{' '}
          <em>isn&rsquo;t</em> in the top-k, the model still answers — from
          whatever was retrieved. The user has no signal that retrieval
          missed.
        </li>
        <li>
          <strong>Embedding similarity is not relevance.</strong> Two
          documents about completely different topics can vector-embed close
          together if they share vocabulary.
        </li>
      </ul>

      <h2>Evaluation</h2>
      <p>
        A real RAG system needs two evals: <em>retrieval</em> (did we find the
        right passages?) and <em>generation</em> (given the right passages,
        did we produce a correct answer?). Most teams skip both. Don&rsquo;t.
      </p>

      <h2>Recap</h2>
      <ul>
        <li>RAG = retrieve relevant passages, then generate using them.</li>
        <li>Retrieval is its own problem — embeddings, ranking, recall.</li>
        <li>RAG is a mitigation, not a fix. Eval both the retrieve and the generate step.</li>
      </ul>
    </LessonShell>
  );
}
