import ProjectInvestigationPage from './investigation/[projectId]/page';

export default function Home() {
  // Default to the first case (UP-1094)
  return (
    <ProjectInvestigationPage
      params={{ projectId: 'UP-1094' }}
    />
  );
}
