import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TestReportItem {
  title: string;
  id: number | null;
  status: string;
  duration: number;
}

export function TestReport({ report }: { report: TestReportItem[] }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🧪 Test Report</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration (ms)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {report.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.id ?? "N/A"}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell className={item.status === "passed" ? "text-green-600" : "text-red-600"}>
                {item.status}
              </TableCell>
              <TableCell>{item.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}