import { notFound } from 'next/navigation';
import ShortsScrollViewer from '../_components/shorts-scroll-viewer';
import { shortVideos } from '../../../data/video-data';
import ShortsViewer from './_components/shorts-viewer';

type Params = Promise<{ category: string; id: string | string[] }>;

export default async function Page({ params }: { params: Params }) {
  const { id: raw, category } = await params;
  const videoId = Array.isArray(raw) ? raw[0] : raw;

  const filteredVideos = shortVideos.filter((v) => v.category === category);
  const initialIndex = filteredVideos.findIndex(
    (v) => String(v.id) === videoId
  );

  if (initialIndex === -1) notFound();

  console.log('filteredVideos : ');

  return (
    <ShortsScrollViewer videos={filteredVideos} initialIndex={initialIndex} />
  );
}
