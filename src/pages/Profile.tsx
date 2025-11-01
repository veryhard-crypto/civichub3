import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Award, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Star,
  Trophy,
  Target,
  Zap,
  Settings
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import RewardContribution from "@/components/RewardContribution";

const Profile = () => {
  const { user } = useAuth();
  
  const userData = user ? {
    name: user.name,
    role: user.role === "reporter" ? "Citizen" : user.role === "solver" ? user.organizationType || "Solver" : "Citizen",
    joinedDate: "March 2024",
    points: user.points || 100,
    level: 5,
    nextLevel: 500,
    eventsJoined: 12,
    issuesReported: 8,
    impactScore: 87,
  } : {
    name: "Alex Johnson",
    role: "Citizen",
    joinedDate: "March 2024",
    points: 485,
    level: 5,
    nextLevel: 500,
    eventsJoined: 12,
    issuesReported: 8,
    impactScore: 87,
  };

  const badges = [
    { id: 1, name: "EcoHero", icon: "🌱", description: "Joined 5 environmental events", earned: true },
    { id: 2, name: "Community Champion", icon: "🏆", description: "Reported 10 issues", earned: false },
    { id: 3, name: "Early Adopter", icon: "⭐", description: "Joined in first month", earned: true },
    { id: 4, name: "Cleanup Master", icon: "✨", description: "Completed 3 cleanup drives", earned: true },
    { id: 5, name: "Tree Planter", icon: "🌳", description: "Planted 50+ trees", earned: false },
    { id: 6, name: "Street Guardian", icon: "🛡️", description: "Fixed 20 street issues", earned: false },
  ];

  // Keep recent activities the same regardless of login status
  const recentActivities = [
    { id: 1, type: "event", title: "Community Cleanup Drive", date: "2 days ago", points: 50 },
    { id: 2, type: "issue", title: "Reported broken street light", date: "5 days ago", points: 25 },
    { id: 3, type: "event", title: "Tree Plantation Drive", date: "1 week ago", points: 75 },
  ];

  const leaderboard = user ? [
    { rank: 1, name: user.name, points: 892, isCurrentUser: true },
    { rank: 2, name: "Community Member", points: 756 },
    { rank: 3, name: "Community Member", points: 485 },
    { rank: 4, name: "Community Member", points: 423 },
    { rank: 5, name: "Community Member", points: 387 },
  ] : [
    { rank: 1, name: "Sarah Miller", points: 892 },
    { rank: 2, name: "Mike Chen", points: 756 },
    { rank: 3, name: "Alex Johnson", points: 485, isCurrentUser: true },
    { rank: 4, name: "Emma Davis", points: 423 },
    { rank: 5, name: "James Wilson", points: 387 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              <div className="text-center space-y-4">
                <Avatar className="w-24 h-24 mx-auto border-4 border-primary/20">
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-secondary text-white">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <Badge variant="secondary" className="mt-2">
                    {userData.role}
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Joined {userData.joinedDate}
                </div>

                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </Card>

            {/* Level Progress */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Level</p>
                    <p className="text-3xl font-bold text-primary">Level {userData.level}</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{userData.points} points</span>
                    <span className="text-muted-foreground">{userData.nextLevel} to next level</span>
                  </div>
                  <Progress value={(userData.points / userData.nextLevel) * 100} className="h-3" />
                </div>
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{userData.eventsJoined}</p>
                      <p className="text-xs text-muted-foreground">Events Joined</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-semibold">{userData.issuesReported}</p>
                      <p className="text-xs text-muted-foreground">Issues Reported</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">{userData.impactScore}%</p>
                      <p className="text-xs text-muted-foreground">Impact Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Middle Column - Badges and Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Badges */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Badges</h3>
                  <p className="text-sm text-muted-foreground">
                    Earned {badges.filter(b => b.earned).length} of {badges.length}
                  </p>
                </div>
                <Award className="w-8 h-8 text-primary" />
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <Card
                    key={badge.id}
                    className={`p-4 text-center transition-all ${
                      badge.earned
                        ? 'border-2 border-primary/20 hover:shadow-lg'
                        : 'opacity-50 grayscale'
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    {badge.earned && (
                      <Badge variant="default" className="mt-2 text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Earned
                      </Badge>
                    )}
                  </Card>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'event' ? 'bg-primary/10' : 'bg-destructive/10'
                        }`}>
                          {activity.type === 'event' ? (
                            <Calendar className={`w-5 h-5 ${activity.type === 'event' ? 'text-primary' : 'text-destructive'}`} />
                          ) : (
                            <MapPin className="w-5 h-5 text-destructive" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        +{activity.points}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Contribution Rewards */}
            <RewardContribution />

            {/* Leaderboard */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">Top contributors this month</p>
                </div>
                <Target className="w-8 h-8 text-accent" />
              </div>

              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <Card
                    key={entry.rank}
                    className={`p-4 transition-all ${
                      entry.isCurrentUser
                        ? 'border-2 border-primary shadow-lg'
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          entry.rank === 1 ? 'bg-yellow-500 text-white' :
                          entry.rank === 2 ? 'bg-gray-400 text-white' :
                          entry.rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-muted text-foreground'
                        }`}>
                          {entry.rank}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {entry.name}
                            {entry.isCurrentUser && (
                              <Badge variant="default" className="ml-2 text-xs">You</Badge>
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-semibold">
                        {entry.points} pts
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
