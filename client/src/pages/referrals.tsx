import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Share2,
  Gift,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Check,
  Mail,
  MessageCircle,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Referrals() {
  const { toast } = useToast();
  const [referralCode] = useState("SFS-GOLDEN-2025");
  const [referralUrl] = useState("https://sfsfamily.com/signup?ref=SFS-GOLDEN-2025");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const shareVia = (platform: string) => {
    const message = "Join SFS Family Dashboard and get 14 days free! 🚀";
    const urls: Record<string, string> = {
      email: `mailto:?subject=${encodeURIComponent(message)}&body=${encodeURIComponent(referralUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }

    toast({
      title: `Shared via ${platform}`,
      description: "Thanks for spreading the word!",
    });
  };

  const referralStats = {
    totalReferrals: 24,
    activeReferrals: 18,
    totalEarnings: 720,
    pendingEarnings: 180,
    thisMonthReferrals: 7,
    conversionRate: 75,
  };

  const recentReferrals = [
    { name: "John Doe", date: "2 days ago", status: "active", earnings: 49 },
    { name: "Jane Smith", date: "5 days ago", status: "active", earnings: 49 },
    { name: "Mike Johnson", date: "1 week ago", status: "pending", earnings: 49 },
    { name: "Sarah Williams", date: "2 weeks ago", status: "active", earnings: 199 },
  ];

  const rewards = [
    {
      referrals: 5,
      reward: "$125",
      bonus: "Bronze Badge",
      reached: true,
    },
    {
      referrals: 10,
      reward: "$300",
      bonus: "Silver Badge + 1 Month Free",
      reached: true,
    },
    {
      referrals: 25,
      reward: "$1,000",
      bonus: "Gold Badge + 3 Months Free",
      reached: false,
    },
    {
      referrals: 50,
      reward: "$2,500",
      bonus: "Platinum Badge + 1 Year Free",
      reached: false,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-gold-shimmer">Referral Program</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Earn rewards by inviting friends to SFS Family Dashboard
        </p>
      </div>

      {/* Referral Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gold">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+{referralStats.thisMonthReferrals}</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gold">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats.activeReferrals}</div>
            <p className="text-xs text-muted-foreground">
              {referralStats.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gold">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${referralStats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">Lifetime commission</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gold">Pending</CardTitle>
            <Gift className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${referralStats.pendingEarnings}</div>
            <p className="text-xs text-muted-foreground">Available soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card className="glass-card animate-slide-up" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <CardTitle className="text-gold">Your Referral Link</CardTitle>
          <CardDescription>Share this link to earn 30% commission on every sale</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gold">Referral Code</label>
            <div className="flex gap-2">
              <Input
                value={referralCode}
                readOnly
                className="glass-card border-border-gold font-mono"
              />
              <Button
                onClick={() => copyToClipboard(referralCode, "Referral code")}
                variant="outline"
                className="glass-card hover-elevate-gold border-border-gold"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gold">Referral URL</label>
            <div className="flex gap-2">
              <Input
                value={referralUrl}
                readOnly
                className="glass-card border-border-gold"
              />
              <Button
                onClick={() => copyToClipboard(referralUrl, "Referral URL")}
                variant="outline"
                className="glass-card hover-elevate-gold border-border-gold"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              onClick={() => shareVia('email')}
              variant="outline"
              className="glass-card hover-elevate-gold border-border-gold"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              onClick={() => shareVia('twitter')}
              variant="outline"
              className="glass-card hover-elevate-gold border-border-gold"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button
              onClick={() => shareVia('linkedin')}
              variant="outline"
              className="glass-card hover-elevate-gold border-border-gold"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              className="glass-card hover-elevate-gold border-border-gold"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Referrals */}
        <Card className="glass-card animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="text-gold">Recent Referrals</CardTitle>
            <CardDescription>Your latest referral signups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReferrals.map((referral, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg glass-card hover-elevate-gold"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-gold-subtle flex items-center justify-center">
                      <Users className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium">{referral.name}</p>
                      <p className="text-xs text-muted-foreground">{referral.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={referral.status === 'active' ? 'default' : 'secondary'}
                      className={referral.status === 'active' ? 'bg-gradient-gold text-black' : ''}
                    >
                      {referral.status}
                    </Badge>
                    <p className="text-sm font-medium text-gold mt-1">+${referral.earnings}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reward Tiers */}
        <Card className="glass-card animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="text-gold">Reward Milestones</CardTitle>
            <CardDescription>Unlock bonuses as you grow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewards.map((reward, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all ${
                    reward.reached
                      ? 'glass-card border-gold bg-gradient-gold-subtle'
                      : 'glass-card border-border-gold opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${reward.reached ? 'text-gold' : 'text-muted-foreground'}`}>
                        {reward.reached ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Award className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gold">
                          {reward.referrals} Referrals
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {reward.bonus}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gold">{reward.reward}</p>
                      {reward.reached && (
                        <Badge className="mt-1 bg-gradient-gold text-black">
                          Earned
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card className="glass-card animate-slide-up" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle className="text-gold">How It Works</CardTitle>
          <CardDescription>Start earning in 3 simple steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-gold-subtle mx-auto flex items-center justify-center">
                <Share2 className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-medium text-gold">1. Share Your Link</h3>
              <p className="text-sm text-muted-foreground">
                Send your unique referral link to friends and colleagues
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-gold-subtle mx-auto flex items-center justify-center">
                <Users className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-medium text-gold">2. They Sign Up</h3>
              <p className="text-sm text-muted-foreground">
                Your referral gets 14 days free trial when they subscribe
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-gold-subtle mx-auto flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-medium text-gold">3. Earn Commission</h3>
              <p className="text-sm text-muted-foreground">
                Get 30% recurring commission on all their payments
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
