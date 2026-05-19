import Link from 'next/link';
import { notFound } from 'next/navigation';
import { tracks, getTrack } from '@/lib/curriculum';
import TrackProgressView from '@/components/TrackProgressView';

export function generateStaticParams() {
  return tracks.map((t) => ({ slug: t.slug }));
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  return (
    <div>
      <div className="mb-6 text-sm">
        <Link href="/" className="text-slate-500 hover:text-brand-600">
          ← All tracks
        </Link>
      </div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{track.title}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 max-w-3xl">
          {track.subtitle}
        </p>
        <p className="text-sm text-slate-500 mt-3 max-w-3xl">{track.audience}</p>
        <p className="text-slate-700 dark:text-slate-300 mt-4 max-w-3xl">{track.description}</p>
      </header>

      <TrackProgressView track={track} />
    </div>
  );
}
