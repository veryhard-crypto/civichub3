import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type Issue = {
  _id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
};

const fetchIssues = async (): Promise<Issue[]> => {
  const res = await fetch("http://localhost:5000/api/issues");
  if (!res.ok) throw new Error("Failed to fetch issues");
  return res.json();
};

const IssuesList = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ["issues"], queryFn: fetchIssues });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">Reported Issues</h1>
      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {error && <p className="text-destructive">{(error as Error).message}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((issue) => {
          const isVeryImportant = issue.status === "open";
          return (
          <Card
            key={issue._id}
            className={
              `p-4 space-y-2 border ${isVeryImportant ? "border-red-300 bg-red-50/40" : ""}`
            }
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{issue.title}</h2>
              <Badge variant="secondary">{issue.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{issue.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{issue.location}</span>
              <Badge
                className={isVeryImportant ? "bg-red-600 text-white" : undefined}
                variant={
                  issue.status === "resolved"
                    ? "default"
                    : issue.status === "in_progress"
                    ? "outline"
                    : "secondary"
                }
              >
                {issue.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{new Date(issue.createdAt).toLocaleString()}</p>
            {isVeryImportant && (
              <p className="text-xs font-medium text-red-700">Very important to solve</p>
            )}
          </Card>
        );})}
        {!isLoading && !error && (!data || data.length === 0) && (
          <p className="text-muted-foreground">No reports yet.</p>
        )}
      </div>
    </div>
  );
};

export default IssuesList;


