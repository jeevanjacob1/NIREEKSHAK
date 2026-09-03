import { NextRequest, NextResponse } from 'next/server';
import { VerifyInvestigationRequest, VerifyInvestigationResponse } from '../../../../types/investigation';

export async function POST(request: NextRequest) {
  try {
    const body: VerifyInvestigationRequest = await request.json();

    if (!body.projectId || !body.action || !body.reviewNotes) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing mandatory fields: projectId, action, or reviewNotes.',
        },
        { status: 400 }
      );
    }

    const auditLogId = `AUD-${Date.now().toString().slice(-6)}`;
    const reviewedAt = body.timestamp || new Date().toISOString();

    const responsePayload: VerifyInvestigationResponse = {
      success: true,
      message: `Official investigation determination [${body.action}] registered into NIREEKSHAK Central Audit Trail.`,
      updatedStatus: {
        projectId: body.projectId,
        action: body.action,
        reviewedBy: body.officerName || 'District Vigilance Officer',
        reviewedAt,
        auditLogId,
      },
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error processing investigation determination.',
        error: err?.message,
      },
      { status: 500 }
    );
  }
}
