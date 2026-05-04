import { redirect } from 'next/navigation';

export default function DashboardRedirect() {
  // In a real app, you would fetch the user's role here
  // const role = getUserRole();
  const role = 'artist'; // hardcoded for scaffolding
  
  if (role === 'artist') {
    redirect('/artist/profile');
  } else if (role === 'agent') {
    redirect('/agent/roster');
  } else if (role === 'talent-buyer') {
    redirect('/talent-buyer/offers');
  } else if (role === 'venue') {
    redirect('/venue/calendar');
  } else if (role === 'organizer') {
    redirect('/organizer/festivals');
  }

  return <div>Loading dashboard...</div>;
}
