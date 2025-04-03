export default interface HistoricalData {
    testcase: string, // ObjectId from the test case
    project: string, // Use the project ID
    Id: number,
    Name: string,
    BuildId: number,
    Duration: number,
    CalcPrio: number,
    LastRun: string,
    NumRan: number,
    Verdict: number,
    Cycle: number,
    LastResults: string[],
}