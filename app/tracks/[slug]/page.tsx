import Link from 'next/link';
import { notFound } from 'next/navigation';
import { tracks, getTrack } from '@/lib/curriculum';

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

      <ol className="space-y-2">
        {track.lessons.map((lesson, i) => {
          const isAvailable = lesson.status === 'available';
          const className = `flex items-start gap-4 p-4 border rounded-lg transition ${
            isAvailable
              ? 'border-slate-200 dark:border-slate-800 hover:border-brand-500'
              : 'border-slate-100 dark:border-slate-900 opacity-60'
          }`;
          const content = (
            <>
              <div className="text-slate-400 font-mono text-sm pt-0.5 w-8">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{lesson.title}</span>
                  <span className="text-xs text-slate-500">~{lesson.estMinutes} min</span>
                  {!isAvailable && (
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      coming soon
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {lesson.summary}
                </div>
              </div>
            </>
          );
          return (
            <li key={lesson.slug}>
              {isAvailable ? (
                <Link href={`/tracks/${track.slug}/${lesson.slug}`} className={className}>
                  {content}
                </Link>
              ) : (
                <div className={className}>{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
