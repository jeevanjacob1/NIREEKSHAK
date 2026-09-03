import ProjectInvestigationPage from './[projectId]/page';

export default function InvestigationRootPage() {
  return (
    <ProjectInvestigationPage
      params={{ projectId: 'MPLADS-000001' }}
    />
  );
}