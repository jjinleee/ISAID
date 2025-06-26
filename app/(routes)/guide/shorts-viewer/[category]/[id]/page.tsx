import { notFound } from 'next/navigation';
import { shortVideos } from '../../../data/video-data';
import ShortsViewer from './_components/shorts-viewer';

type Params = Promise<{ category: string; id: string | string[] }>;

export default async function Page({ params }: { params: Params }) {
  const { id: raw, category } = await params;

  const videoId = Array.isArray(raw) ? raw[0] : raw;

  const video = shortVideos.find((v) => String(v.id) === videoId);

  if (!video) notFound();

  return <ShortsViewer video={video} />;
}
