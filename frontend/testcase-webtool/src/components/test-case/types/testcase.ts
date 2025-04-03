import Script from "./script";
import Step from "./step";
export default interface TestCase {
    _id?: string; // MongoDB _id field
    id: number;
    name: string;
    priority: number;
    description: string;
    assignedTo: string; // User ID
    status: string;
    preconditions: string;
    steps: Step[];
    script?:Script;
  }