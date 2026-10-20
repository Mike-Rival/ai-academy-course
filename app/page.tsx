import HomeTrackCards from '@/components/HomeTrackCards';

export default function Home() {
  return (
    <div>
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Learn to work with AI you can actually trust.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
          Start with <strong>Working with LLMs</strong>: a no-code course on how large
          language models fail, when to rely on them, and how to verify what they give
          you. Then, if you want to go deeper, learn Python, machine learning, and how
          the models work underneath.
        </p>
        <p className="text-sm text-slate-500 mt-3 max-w-3xl">
          Everything runs in your browser. No account, no installs. Your progress is
          saved locally to your device.
        </p>
      </section>

      <HomeTrackCards />
    </div>
  );
}
