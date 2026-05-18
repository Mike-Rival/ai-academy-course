import Link from 'next/link';

type Track = {
  slug: string;
  title: string;
  subtitle: string;
  audience: string;
  status: 'available' | 'coming-soon';
};

const tracks: Track[] = [
  {
    slug: 'python',
    title: 'Python Basics',
    subtitle: 'Variables, control flow, data structures, numpy, pandas.',
    audience: 'For learners new to programming or new to Python.',
    status: 'available',
  },
  {
    slug: 'ml',
    title: 'Machine Learning Basics',
    subtitle: 'Regression, classification, evaluation, pipelines — with scikit-learn.',
    audience: 'For learners comfortable with Python who want practical ML.',
    status: 'coming-soon',
  },
  {
    slug: 'ai',
    title: 'AI & Deep Learning',
    subtitle: 'Tokenization, embeddings, transformers, using pre-trained models.',
    audience: 'For learners who know ML basics and want to understand modern AI.',
    status: 'coming-soon',
  },
  {
    slug: 'llm-literacy',
    title: 'Working with LLMs',
    subtitle:
      'Risk literacy for the workplace. How LLMs fail, when to trust them, when not to.',
    audience: 'No coding required. For everyone who uses or evaluates AI tools at work.',
    status: 'coming-soon',
  },
];

export default function Home() {
  return (
    <div>
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Learn Python, ML, AI — and how to use AI responsibly.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
          Interactive lessons that run entirely in your browser. Pick a track based on
          where you are today. Your progress is saved locally to your device.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        {tracks.map((t) => (
          <Link
            key={t.slug}
            href={`/tracks/${t.slug}`}
            className="block border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-brand-500 transition"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-semibold">{t.title}</h2>
              {t.status === 'coming-soon' && (
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  coming soon
                </span>
              )}
            </div>
            <p className="text-slate-700 dark:text-slate-300">{t.subtitle}</p>
            <p className="text-sm text-slate-500 mt-2">{t.audience}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
