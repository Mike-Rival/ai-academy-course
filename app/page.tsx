import HomeTrackCards from '@/components/HomeTrackCards';

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

      <HomeTrackCards />
    </div>
  );
}
