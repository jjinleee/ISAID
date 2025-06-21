// app/guide/shorts-viewer/[id]/page.tsx

import { notFound } from 'next/navigation';
import { shortVideos } from '../../data/video-data';
import ShortsViewer from './_components/shorts-viewer';

export default function Page({ params }: { params: any }) {
  const video = shortVideos.find((v) => String(v.id) === params.id);

  if (!video) notFound();

  return <ShortsViewer video={video} />;
}
