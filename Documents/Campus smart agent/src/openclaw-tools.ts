import axios from 'axios';

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';

export const openClawToolsSchema = [
  {
    type: 'function',
    function: {
      name: 'fetch_student_bulletin',
      description: 'Fetch the academic bulletin (grades/report card) for a specific student and trimester.',
      parameters: {
        type: 'object',
        properties: {
          studentId: {
            type: 'string',
            description: 'The unique identifier of the student.',
          },
          trimestre: {
            type: 'string',
            description: 'The trimester identifier (e.g., T1, T2, T3).',
          },
        },
        required: ['studentId', 'trimestre'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'fetch_financial_status',
      description: 'Fetch the financial status (payments, debts) for a specific student.',
      parameters: {
        type: 'object',
        properties: {
          studentId: {
            type: 'string',
            description: 'The unique identifier of the student.',
          },
        },
        required: ['studentId'],
      },
    },
  },
];

export async function executeFetchStudentBulletin(studentId: string, trimestre: string): Promise<any> {
  const response = await axios.get(`${PYTHON_BACKEND_URL}/api/students/${studentId}/bulletin`, {
    params: { trimestre },
  });
  return response.data;
}

export async function executeFetchFinancialStatus(studentId: string): Promise<any> {
  const response = await axios.get(`${PYTHON_BACKEND_URL}/api/students/${studentId}/finance`);
  return response.data;
}
