import { executeFetchStudentBulletin, executeFetchFinancialStatus } from './openclaw-tools';

export interface ActionResponse {
  status: 'success' | 'error';
  data?: any;
  message?: string;
}

export async function handleOpenClawAction(toolName: string, args: Record<string, any>): Promise<ActionResponse> {
  try {
    switch (toolName) {
      case 'fetch_student_bulletin': {
        if (!args.studentId || !args.trimestre) {
          return { 
            status: 'error', 
            message: 'Missing required arguments: studentId, trimestre' 
          };
        }
        const data = await executeFetchStudentBulletin(args.studentId, args.trimestre);
        return { status: 'success', data };
      }
      
      case 'fetch_financial_status': {
        if (!args.studentId) {
          return { 
            status: 'error', 
            message: 'Missing required argument: studentId' 
          };
        }
        const data = await executeFetchFinancialStatus(args.studentId);
        return { status: 'success', data };
      }
      
      default:
        return { 
          status: 'error', 
          message: `Unknown tool name: ${toolName}` 
        };
    }
  } catch (error: any) {
    return { 
      status: 'error', 
      message: error.response?.data?.message || error.message || 'An unexpected error occurred during tool execution'
    };
  }
}
