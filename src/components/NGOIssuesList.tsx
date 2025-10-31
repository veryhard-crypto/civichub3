import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

type Issue = {
  _id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
};

const fetchIssues = async (): Promise<Issue[]> => {
  const res = await fetch("/api/issues");
  if (!res.ok) throw new Error("Failed to fetch issues");
  return res.json();
};

const updateIssue = async ({ id, status }: { id: string; status: Issue["status"] }) => {
  const res = await fetch(`/api/issues/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update issue");
  return res.json();
};

const NGOIssuesList = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["issues"], queryFn: fetchIssues });
  const mutation = useMutation({
    mutationFn: updateIssue,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["issues"] }),
  });

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
            className={`p-4 space-y-3 border ${isVeryImportant ? "border-red-300 bg-red-50/40" : ""}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{issue.title}</h2>
              <Badge variant="secondary">{issue.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{issue.description}</p>
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

            <div className="flex items-center justify-between pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">View details</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{issue.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Category: {issue.category}</div>
                    <div className="text-sm">{issue.description}</div>
                    <div className="text-sm text-muted-foreground">Location: {issue.location}</div>
                    <div className="text-xs text-muted-foreground">Reported: {new Date(issue.createdAt).toLocaleString()}</div>

                    <div className="flex items-center gap-2 pt-2">
                      <Checkbox
                        id={`resolved-${issue._id}`}
                        checked={issue.status === "resolved"}
                        disabled={mutation.isPending}
                        onCheckedChange={(checked) => {
                          mutation.mutate({ id: issue._id, status: checked ? "resolved" : "in_progress" });
                        }}
                      />
                      <label htmlFor={`resolved-${issue._id}`} className="text-sm">
                        Mark as resolved
                      </label>
                    </div>
                    {isVeryImportant && (
                      <p className="text-xs font-medium text-red-700">Very important to solve</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {issue.status !== "resolved" && (
                <Button
                  size="sm"
                  onClick={() => mutation.mutate({ id: issue._id, status: "in_progress" })}
                  disabled={mutation.isPending}
                >
                  Set In Progress
                </Button>
              )}
            </div>
          </Card>
        );})}
        {!isLoading && !error && (!data || data.length === 0) && (
          <p className="text-muted-foreground">No reports yet.</p>
        )}
      </div>
    </div>
  );
};

export default NGOIssuesList;


