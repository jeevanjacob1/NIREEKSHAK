import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PROJECTS_DATABASE, MOCK_PROJECT_INVESTIGATION_DATA } from '../../../../../lib/mockData';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
  const projectId = decodeURIComponent(resolvedParams.id);

  const projectData = MOCK_PROJECTS_DATABASE[projectId] || {
    ...MOCK_PROJECT_INVESTIGATION_DATA,
    header: {
      ...MOCK_PROJECT_INVESTIGATION_DATA.header,
      projectId: projectId || 'MPLADS-2024-UP54-0892',
    },
  };

  return NextResponse.json(projectData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json',
    },
  });
}
