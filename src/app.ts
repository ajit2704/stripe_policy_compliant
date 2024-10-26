import express, { NextFunction, Request, Response } from 'express';
import  { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { fetchCompliancePolicyContent } from './complianceChecker';
import { fetchWebpageContent } from './fetchWebPage';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };


// Function to compare webpage content against a compliance policy
const checkCompliance = async (content: string, policy: string): Promise<string> => {
  const prompt = `Check the following webpage content against this compliance policy: ${policy}. Report non-compliant findings:\n\nWebpage Content:\n${content}`;

  try {
    const response : any = await openai.chat.completions.create({
     messages: [{role: 'user', name: 'check_compliance', content: prompt}],
     model: "gpt-3.5-turbo"    });
    return response || 'No issues found';
  } catch (error : any) {
    throw new Error(`Error checking compliance: ${error.message}`);
  }
};

// POST route to handle compliance checking
app.post('/check_compliance', asyncHandler(async (req: Request, res: Response) => {
  const { webpage_url, compliance_policy } = req.body;

  if (!webpage_url || !compliance_policy) {
    return res.status(400).json({ error: "Missing required fields: 'webpage_url' and 'compliance_policy'" });
  }

  try {
    // Step 1: Fetch the webpage content
    const content = await fetchWebpageContent(webpage_url);
    console.log(content);
    // Step 2: Fetch the compliance policy content
    const policyContent = await fetchCompliancePolicyContent(compliance_policy );
    console.log(policyContent);
    // Step 3: Compare the content with the compliance policy
    const findings = await checkCompliance(content, policyContent);
    // Step 4: Return the findings
    res.json({
      webpage_url,
      compliance_policy,
      non_compliant_findings: findings,
    });
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
}));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
