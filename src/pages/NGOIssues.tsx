import Navbar from "@/components/Navbar";
import NGOIssuesList from "@/components/NGOIssuesList";

const NGOIssues = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-6 max-w-5xl">
        <div className="mb-4 rounded-md border p-4 bg-muted/30">
          <h2 className="text-xl font-semibold">NGO Workspace</h2>
          <p className="text-sm text-muted-foreground">
            View all issues reported by citizens. Use this list to pick, triage, and resolve items.
          </p>
        </div>
      </div>
      <NGOIssuesList />
    </div>
  );
};

export default NGOIssues;


