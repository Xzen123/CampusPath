import { findProfileByUserId } from '@/lib/data';
import { getUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/profile/profile-form';

export default async function ProfilePage() {
  const user = await getUser();
  if (!user || user.role !== 'Student') {
    // Or redirect to a 'not authorized' page
    redirect('/dashboard');
  }

  const profile = await findProfileByUserId(user.id);

  if (!profile) {
    return <div>Could not find profile.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">My Profile</h1>
      <p className="text-muted-foreground mb-6">Keep your profile updated to attract the best opportunities.</p>
      <ProfileForm profile={profile} />
    </div>
  );
}
