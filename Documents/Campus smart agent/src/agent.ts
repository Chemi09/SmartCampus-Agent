import { GoogleGenAI, Type, FunctionDeclaration, Tool, Content } from '@google/genai';
import axios from 'axios';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';

const fetchStudentBulletinDeclaration: FunctionDeclaration = {
  name: 'fetchStudentBulletin',
  description: 'Fetch the academic bulletin (grades/report card) for a specific student and trimester.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      studentId: {
        type: Type.STRING,
        description: 'The unique identifier of the student.',
      },
      trimestre: {
        type: Type.NUMBER,
        description: 'The trimester identifier (e.g., 1, 2, 3).',
      },
    },
    required: ['studentId', 'trimestre'],
  },
};

const fetchFinancialStatusDeclaration: FunctionDeclaration = {
  name: 'fetchFinancialStatus',
  description: 'Fetch the financial status (payments, debts) for a specific student.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      studentId: {
        type: Type.STRING,
        description: 'The unique identifier of the student.',
      },
    },
    required: ['studentId'],
  },
};

const edusovereignTools: Tool[] = [
  {
    functionDeclarations: [fetchStudentBulletinDeclaration, fetchFinancialStatusDeclaration],
  },
];

const toolsImplementation: Record<string, (args: any) => Promise<any>> = {
  fetchStudentBulletin: async (args: { studentId: string; trimestre: number }) => {
    return {
      studentId: args.studentId,
      studentName: "Merveille Yaba",
      trimestre: args.trimestre,
      niveau: "Licence",
      etablissement: "Université Pédagogique Nationale (UPN)",
      notes: [
        { matiere: "Mathématiques", note: 16, max: 20 },
        { matiere: "Physique", note: 14, max: 20 },
        { matiere: "Informatique", note: 19, max: 20 }
      ],
      moyenneGenerale: 16.3,
      conduite: "Excellente"
    };
  },
  fetchFinancialStatus: async (args: { studentId: string }) => {
    return {
      studentId: args.studentId,
      studentName: "Merveille Yaba",
      anneeScolaire: "2025-2026",
      totalFrais: "1500 USD",
      montantPaye: "1000 USD",
      soldeRestant: "500 USD",
      statutPaiement: "Partiel",
      prochaineEcheance: "2026-06-01"
    };
  },
};

export async function chatWithParent(parentMessage: string): Promise<string> {
  try {
    const systemInstruction = "Tu es l'assistant officiel de Smart Campus Agent. Réponds poliment. Si le parent parle en lingala, réponds en lingala. Si c'est en français, réponds en français. Utilise obligatoirement les outils pour vérifier les données réelles.";

    const contents: Content[] = [
      { role: 'user', parts: [{ text: parentMessage }] }
    ];

    while (true) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          tools: edusovereignTools,
        },
      });

      const functionCalls = response.functionCalls;

      if (functionCalls && functionCalls.length > 0) {
        const assistantContent = response.candidates?.[0]?.content;
        if (assistantContent) {
          contents.push(assistantContent);
        }

        const functionResponsesParts: any[] = [];

        for (const call of functionCalls) {
          const toolName = call.name;
          const toolArgs = call.args;
          
          let resultData;
          try {
            if (toolName && toolsImplementation[toolName]) {
              resultData = await toolsImplementation[toolName](toolArgs);
            } else {
              resultData = { error: `Unknown tool: ${toolName}` };
            }
          } catch (error: any) {
            resultData = { error: error.response?.data?.message || error.message || 'Failed to execute tool' };
          }

          functionResponsesParts.push({
            functionResponse: {
              name: toolName,
              response: resultData,
            },
          });
        }

        // CORRECTIF ICI : Le rôle doit être 'tool' pour injecter les réponses de fonction
        contents.push({ role: 'tool', parts: functionResponsesParts });
      } else {
        return response.text || '';
      }
    }
  } catch (error) {
    console.error('Error in chatWithParent:', error);
    return "Une erreur inattendue s'est produite lors du traitement de votre demande. Veuillez réessayer plus tard.";
  }
}
