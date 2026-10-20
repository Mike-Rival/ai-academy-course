// Single source of truth for track metadata, lesson order, and titles.
// Each lesson's actual content lives in app/tracks/<slug>/<lesson-slug>/page.tsx.

export type LessonMeta = {
  slug: string;
  title: string;
  summary: string;
  estMinutes: number;
  status: 'available' | 'coming-soon';
};

export type TrackMeta = {
  slug: string;
  title: string;
  subtitle: string;
  audience: string;
  description: string;
  lessons: LessonMeta[];
  /** Featured tracks render as a full-width "start here" card on the home page. */
  featured?: boolean;
  /** Short badge shown on the home card, e.g. "No coding required". */
  badge?: string;
  /** A few concrete takeaways, shown on the featured home card. */
  highlights?: string[];
};

export const tracks: TrackMeta[] = [
  {
    slug: 'python',
    title: 'Python Basics',
    subtitle: 'Variables, control flow, data structures, numpy, pandas.',
    audience: 'For learners new to programming or new to Python.',
    description:
      'Hands-on Python from zero. You will write and run code in your browser starting in lesson 1. No setup required.',
    lessons: [
      {
        slug: '01-variables',
        title: 'Variables and Printing',
        summary: 'Store values in names. See them with print().',
        estMinutes: 8,
        status: 'available',
      },
      { slug: '02-types', title: 'Types and Conversions', summary: 'int, float, str, bool — and how to convert between them.', estMinutes: 10, status: 'available' },
      { slug: '03-control-flow', title: 'Control Flow', summary: 'if / elif / else, comparisons, boolean logic.', estMinutes: 12, status: 'available' },
      { slug: '04-loops', title: 'Loops', summary: 'for and while loops, range, break, continue.', estMinutes: 12, status: 'available' },
      { slug: '05-functions', title: 'Functions', summary: 'Define, call, return values, default arguments.', estMinutes: 15, status: 'available' },
      { slug: '06-lists-and-dicts', title: 'Lists and Dictionaries', summary: 'The two workhorse containers in Python.', estMinutes: 15, status: 'available' },
      { slug: '07-files-and-strings', title: 'Files and Strings', summary: 'Reading, writing, parsing.', estMinutes: 12, status: 'available' },
      { slug: '08-numpy', title: 'NumPy Arrays', summary: 'Why arrays exist; vectorized math.', estMinutes: 15, status: 'available' },
      { slug: '09-pandas', title: 'Pandas DataFrames', summary: 'Tables of data; loading, filtering, grouping.', estMinutes: 18, status: 'available' },
      { slug: '10-mini-project', title: 'Mini Project', summary: 'Put it together: a small data exploration end-to-end.', estMinutes: 25, status: 'available' },
    ],
  },
  {
    slug: 'ai-coding',
    title: 'Coding with AI Assistants',
    subtitle:
      'Specs, small units, tests, diffs, agents — and how to catch confident wrong code.',
    audience:
      'For developers (Python Basics level or above) who use or plan to use AI coding tools.',
    description:
      'A working method for autocomplete, chat, and agentic coding tools: write tasks the model cannot misread, keep units small, let tests do the judging, read every diff, and know the failure modes well enough to spot them in code that compiles and looks clean. Tools are named generically; the habits transfer.',
    lessons: [
      { slug: '01-what-an-assistant-sees', title: 'What a Coding Assistant Actually Sees', summary: 'Autocomplete vs chat vs agents; the context window is all it has; why "it compiled" is weak evidence.', estMinutes: 12, status: 'available' },
      { slug: '02-writing-the-task', title: 'Writing a Task the Model Cannot Misread', summary: 'Inputs, outputs, constraints, examples, done-criteria, non-goals. The spec is the test.', estMinutes: 15, status: 'available' },
      { slug: '03-small-units', title: 'The Loop: Ask, Read the Diff, Run, Repeat', summary: 'Small testable units beat big asks. Read every line you accept. Checkpoint with git.', estMinutes: 12, status: 'available' },
      { slug: '04-tests-are-the-check', title: 'Tests Are the Verification Layer', summary: 'Tests first, adversarial cases, and why the model never grades its own output.', estMinutes: 15, status: 'available' },
      { slug: '05-reading-generated-code', title: 'Reading Generated Code: The Failure Catalog', summary: 'Hallucinated APIs, wrong formulas, boundary errors, swallowed exceptions — and three clean-looking bugs to find.', estMinutes: 18, status: 'available' },
      { slug: '06-debugging-with-an-assistant', title: 'Debugging Without Being Led in Circles', summary: 'Full error, minimal repro, a hypothesis before a fix, a fresh thread when it loops.', estMinutes: 15, status: 'available' },
      { slug: '07-context-for-repos', title: 'Context Engineering for a Codebase', summary: 'Project instruction files, what goes where, pointing at files instead of pasting, why sessions degrade.', estMinutes: 12, status: 'available' },
      { slug: '08-agentic-workflows', title: 'Agentic Workflows: Plan, Implement, Verify', summary: 'When to let an agent run, checkpoints, reviewing multi-file diffs, compound-error math, cost.', estMinutes: 15, status: 'available' },
      { slug: '09-security-and-provenance', title: 'Security, Secrets, and Provenance', summary: 'Secrets in prompts, hallucinated packages, license provenance, prompt injection, generated shell commands.', estMinutes: 15, status: 'available' },
      { slug: '10-capstone', title: 'Capstone: Ship a Small Feature With a Verification Log', summary: 'Spec → tests → implement with an assistant → review → log what was verified and how.', estMinutes: 25, status: 'available' },
    ],
  },
  {
    slug: 'ml',
    title: 'Machine Learning Basics',
    subtitle: 'Regression, classification, evaluation, pipelines — with scikit-learn.',
    audience: 'For learners comfortable with Python who want practical ML.',
    description:
      'Practical ML using scikit-learn. Emphasis on what each model assumes, when it breaks, and how to tell.',
    lessons: [
      { slug: '01-what-is-ml', title: 'What is Machine Learning?', summary: 'Supervised, unsupervised; what "learning" actually means here.', estMinutes: 10, status: 'available' },
      { slug: '02-linear-regression', title: 'Linear Regression', summary: 'The simplest model. Fit, predict, residuals.', estMinutes: 15, status: 'available' },
      { slug: '03-classification', title: 'Classification', summary: 'Logistic regression and decision boundaries.', estMinutes: 15, status: 'available' },
      { slug: '04-train-test-split', title: 'Train/Test Split', summary: 'Why test on data you trained on lies to you.', estMinutes: 12, status: 'available' },
      { slug: '05-cross-validation', title: 'Cross-Validation', summary: 'A more honest answer than a single split.', estMinutes: 12, status: 'available' },
      { slug: '06-trees-and-forests', title: 'Trees and Forests', summary: 'Decision trees, random forests — when and why they work.', estMinutes: 18, status: 'available' },
      { slug: '07-clustering', title: 'Clustering', summary: 'k-means and the limits of unsupervised learning.', estMinutes: 12, status: 'available' },
      { slug: '08-pipelines', title: 'Pipelines', summary: 'Preprocessing + model as one object you can serialize.', estMinutes: 15, status: 'available' },
      { slug: '09-feature-engineering', title: 'Feature Engineering', summary: 'Most ML wins live here, not in the model.', estMinutes: 18, status: 'available' },
      { slug: '10-end-to-end', title: 'End-to-End Project', summary: 'A complete model from raw CSV to evaluation.', estMinutes: 30, status: 'available' },
    ],
  },
  {
    slug: 'ai',
    title: 'AI & Deep Learning',
    subtitle: 'Tokenization, embeddings, transformers, using pre-trained models.',
    audience: 'For learners who know ML basics and want to understand modern AI.',
    description:
      'How modern AI models actually work, what they can and cannot do, and how to use them via small in-browser demos plus "Open in Colab" notebooks for training.',
    lessons: [
      { slug: '01-tokenization', title: 'Tokenization', summary: 'How text becomes numbers a model can see.', estMinutes: 12, status: 'available' },
      { slug: '02-embeddings', title: 'Embeddings', summary: 'Vectors that capture meaning. Why similarity ≠ truth.', estMinutes: 15, status: 'available' },
      { slug: '03-attention', title: 'Attention, Intuitively', summary: 'What "looking at other tokens" really means.', estMinutes: 15, status: 'available' },
      { slug: '04-transformer-architecture', title: 'The Transformer', summary: 'Stacking blocks. Why this architecture won.', estMinutes: 18, status: 'available' },
      { slug: '05-using-pretrained', title: 'Using Pre-trained Models', summary: 'Run a model in your browser via transformers.js.', estMinutes: 15, status: 'available' },
      { slug: '06-fine-tuning-concepts', title: 'Fine-Tuning — Concepts', summary: 'When it helps, when prompting is enough.', estMinutes: 12, status: 'available' },
      { slug: '07-prompting', title: 'Prompting', summary: 'Patterns that help; "magic prompts" that do not.', estMinutes: 12, status: 'available' },
      { slug: '08-rag-basics', title: 'RAG Basics', summary: 'Retrieval-augmented generation, and what it does not solve.', estMinutes: 15, status: 'available' },
      { slug: '09-evaluation', title: 'Evaluating AI Systems', summary: 'Why "it looks good" is not an evaluation.', estMinutes: 15, status: 'available' },
      { slug: '10-capstone', title: 'Capstone', summary: 'Combine retrieval + a small model on a real task.', estMinutes: 30, status: 'available' },
    ],
  },
  {
    slug: 'llm-literacy',
    title: 'Working with LLMs',
    featured: true,
    badge: 'No coding required',
    highlights: [
      'Why fluent, confident output is the weakest evidence of correctness',
      'A four-question test for deciding whether to use an LLM on a task',
      'What RAG, agents, and fine-tuning actually fix — and what they do not',
      'What not to paste into a chatbot, and prompting habits that hold up',
    ],
    subtitle:
      'Risk literacy for the workplace. How LLMs fail, when to trust them, when not to.',
    audience: 'For everyone who uses or evaluates AI tools at work — no technical background needed.',
    description:
      'This track teaches risk literacy, not prescriptions. Every lesson shows failure modes alongside benefits so you can decide for yourself when an LLM is worth using and how to verify the output.',
    lessons: [
      { slug: '01-what-llms-actually-do', title: 'What LLMs Actually Do', summary: 'Next-token prediction, stochasticity, and why "it sounded confident" is the worst evidence.', estMinutes: 10, status: 'available' },
      { slug: '02-why-they-feel-trustworthy', title: 'Why LLMs Feel Trustworthy When They Are Not', summary: 'Fluency was trained for. Sycophancy. Reasoning traces ≠ reasoning.', estMinutes: 12, status: 'available' },
      { slug: '03-hallucinations', title: 'Hallucinations in the Wild', summary: 'Real bad examples and their downstream cost.', estMinutes: 15, status: 'available' },
      { slug: '04-conversation-rot', title: 'Conversation Rot', summary: 'Why quality degrades over long chats.', estMinutes: 10, status: 'available' },
      { slug: '05-citation-trap', title: 'The Citation Trap', summary: 'Sources cited, sources not actually read correctly.', estMinutes: 12, status: 'available' },
      { slug: '06-unverifiability-trap', title: 'The Unverifiability Trap', summary: 'When the value and the risk are the same property.', estMinutes: 15, status: 'available' },
      { slug: '07-self-judgment', title: 'Models Cannot Judge Themselves', summary: 'Confidence scores, self-grading, "are you sure?" — all nonsense.', estMinutes: 10, status: 'available' },
      { slug: '08-validation-test', title: 'The Validation Test', summary: 'A decision framework you can apply today.', estMinutes: 12, status: 'available' },
      { slug: '09-mitigations', title: 'Mitigations and Their Hidden Costs', summary: 'RAG, agents, fine-tuning — what they fix and what they do not.', estMinutes: 15, status: 'available' },
      { slug: '10-reading-claims', title: 'Reading "LLMs Are Good At X" Claims', summary: 'Sample size, cherry-picking, generalizability.', estMinutes: 12, status: 'available' },
      { slug: '11-where-they-help', title: 'Where LLMs Reliably Help (With Caveats)', summary: 'A short, honest list.', estMinutes: 10, status: 'available' },
      { slug: '12-privacy', title: 'Privacy and Data Handling', summary: 'What not to paste into a public chatbot.', estMinutes: 10, status: 'available' },
      { slug: '13-prompting-hygiene', title: 'Prompting Hygiene Without Overpromising', summary: 'What helps, what does not.', estMinutes: 10, status: 'available' },
      { slug: '14-capstone', title: 'Capstone: Decide Before You Use', summary: 'A workplace task, a decision framework, a verification plan.', estMinutes: 20, status: 'available' },
    ],
  },
];

export function getTrackMinutes(track: TrackMeta): number {
  return track.lessons.reduce((sum, l) => sum + l.estMinutes, 0);
}

export function getTrack(slug: string): TrackMeta | undefined {
  return tracks.find((t) => t.slug === slug);
}

export function getLessonNav(trackSlug: string, lessonSlug: string) {
  const track = getTrack(trackSlug);
  if (!track) return {};
  const idx = track.lessons.findIndex((l) => l.slug === lessonSlug);
  if (idx === -1) return {};
  const prev = track.lessons[idx - 1];
  const next = track.lessons[idx + 1];
  return {
    prevHref: prev ? `/tracks/${trackSlug}/${prev.slug}` : undefined,
    prevTitle: prev?.title,
    nextHref: next ? `/tracks/${trackSlug}/${next.slug}` : undefined,
    nextTitle: next?.title,
  };
}
