import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import EditProfileContainer from './_components/edit-profile-container';

const EditProfilePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  return <EditProfileContainer session={session} />;
};

export default EditProfilePage;
