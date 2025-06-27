import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import ShortsScrollViewer from './_components/shorts-scroll-viewer';
import ShortsViewer from './_components/shorts-viewer-container';

export default async function Page() {
  const session = await getServerSession(authOptions);

  return <ShortsViewer session={session} />;
  // return <ShortsScrollViewer session={session}  />;
}
