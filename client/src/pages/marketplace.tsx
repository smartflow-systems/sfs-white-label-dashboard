import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Star,
  Download,
  CheckCircle2,
  TrendingUp,
  Zap,
  Shield,
  Sparkles,
  Users,
  Globe,
  Mail,
  MessageSquare,
  ShoppingCart,
  Database,
  BarChart3,
  Lock,
} from "lucide-react";
import {
  SiStripe,
  SiGoogle,
  SiSlack,
  SiShopify,
  SiSalesforce,
  SiTwilio,
  SiMailchimp,
  SiIntercom,
} from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

const categories = ["All", "Analytics", "Communication", "E-commerce", "CRM", "Marketing", "Security"];

const integrations = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept payments and manage subscriptions",
    category: "E-commerce",
    icon: SiStripe,
    color: "from-purple-500 to-purple-600",
    rating: 4.9,
    installs: 45000,
    tier: "free",
    featured: true,
    installed: true,
    tags: ["Payments", "Subscriptions", "Popular"],
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track website traffic and user behavior",
    category: "Analytics",
    icon: SiGoogle,
    color: "from-orange-500 to-orange-600",
    rating: 4.8,
    installs: 38000,
    tier: "free",
    featured: true,
    installed: true,
    tags: ["Analytics", "Tracking", "Popular"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send notifications to your team channels",
    category: "Communication",
    icon: SiSlack,
    color: "from-pink-500 to-pink-600",
    rating: 4.7,
    installs: 32000,
    tier: "free",
    featured: false,
    installed: true,
    tags: ["Notifications", "Team Chat"],
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Sync your e-commerce store data",
    category: "E-commerce",
    icon: SiShopify,
    color: "from-green-500 to-green-600",
    rating: 4.6,
    installs: 28000,
    tier: "pro",
    featured: true,
    installed: false,
    tags: ["E-commerce", "Inventory"],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Connect your CRM and sales pipeline",
    category: "CRM",
    icon: SiSalesforce,
    color: "from-blue-500 to-blue-600",
    rating: 4.5,
    installs: 25000,
    tier: "pro",
    featured: true,
    installed: false,
    tags: ["CRM", "Sales", "Enterprise"],
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "Send SMS and voice communications",
    category: "Communication",
    icon: SiTwilio,
    color: "from-red-500 to-red-600",
    rating: 4.7,
    installs: 22000,
    tier: "pro",
    featured: false,
    installed: false,
    tags: ["SMS", "Voice", "Communication"],
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Manage email campaigns and automation",
    category: "Marketing",
    icon: SiMailchimp,
    color: "from-yellow-500 to-yellow-600",
    rating: 4.4,
    installs: 20000,
    tier: "pro",
    featured: false,
    installed: false,
    tags: ["Email", "Marketing", "Automation"],
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "Customer messaging and support platform",
    category: "Communication",
    icon: SiIntercom,
    color: "from-indigo-500 to-indigo-600",
    rating: 4.6,
    installs: 18000,
    tier: "enterprise",
    featured: false,
    installed: false,
    tags: ["Support", "Chat", "Customer Success"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Marketing, sales, and service platform",
    category: "CRM",
    icon: Database,
    color: "from-orange-500 to-red-600",
    rating: 4.5,
    installs: 16000,
    tier: "enterprise",
    featured: false,
    installed: false,
    tags: ["CRM", "Marketing", "Enterprise"],
  },
  {
    id: "auth0",
    name: "Auth0",
    description: "Advanced authentication and security",
    category: "Security",
    icon: Lock,
    color: "from-gray-500 to-gray-600",
    rating: 4.8,
    installs: 24000,
    tier: "enterprise",
    featured: true,
    installed: false,
    tags: ["Security", "Authentication", "SSO"],
  },
  {
    id: "mixpanel",
    name: "Mixpanel",
    description: "Advanced product analytics platform",
    category: "Analytics",
    icon: BarChart3,
    color: "from-purple-500 to-pink-600",
    rating: 4.6,
    installs: 15000,
    tier: "pro",
    featured: false,
    installed: false,
    tags: ["Analytics", "Product", "Insights"],
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Transactional email delivery service",
    category: "Communication",
    icon: Mail,
    color: "from-blue-500 to-cyan-600",
    rating: 4.7,
    installs: 21000,
    tier: "free",
    featured: false,
    installed: false,
    tags: ["Email", "Transactional", "Delivery"],
  },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest">("popular");
  const { toast } = useToast();

  const filteredIntegrations = integrations
    .filter((integration) => {
      const matchesSearch =
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || integration.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.installs - a.installs;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const featuredIntegrations = integrations.filter((i) => i.featured);

  const handleInstall = (integration: typeof integrations[0]) => {
    if (integration.installed) {
      toast({
        title: "✅ Already Installed",
        description: `${integration.name} is already connected to your account.`,
      });
    } else if (integration.tier === "enterprise") {
      toast({
        title: "🔒 Enterprise Required",
        description: `${integration.name} requires an Enterprise plan. Upgrade to access.`,
        variant: "destructive",
      });
    } else if (integration.tier === "pro") {
      toast({
        title: "⚡ Pro Required",
        description: `${integration.name} requires a Pro plan. Upgrade to install.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "🚀 Installing Integration",
        description: `Setting up ${integration.name}... This will take a few seconds.`,
      });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">Integration Marketplace</h1>
        <p className="text-muted-foreground">
          Connect your favorite tools and supercharge your workflow
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 animate-slide-up">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg glass-card border border-border bg-background"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? "default" : "outline"}
            className={
              selectedCategory === category
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700"
                : ""
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Featured Integrations */}
      {selectedCategory === "All" && searchQuery === "" && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-2xl font-bold">Featured Integrations</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredIntegrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <Card
                  key={integration.id}
                  className="glass-card p-6 hover-elevate-gold animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${integration.color} flex items-center justify-center`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    {integration.installed && (
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Installed
                      </Badge>
                    )}
                    {!integration.installed && integration.tier !== "free" && (
                      <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                        {integration.tier}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{integration.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4 text-muted-foreground" />
                      <span>{(integration.installs / 1000).toFixed(0)}K</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {integration.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleInstall(integration)}
                    className="w-full"
                    variant={integration.installed ? "outline" : "default"}
                  >
                    {integration.installed ? "Configure" : "Install"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Integrations */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {selectedCategory === "All" ? "All" : selectedCategory} Integrations
          <span className="text-muted-foreground text-lg ml-2">({filteredIntegrations.length})</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIntegrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <Card
                key={integration.id}
                className="glass-card p-5 hover-elevate-gold animate-slide-up"
                style={{ animationDelay: `${(index % 12) * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${integration.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {integration.installed && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <h3 className="font-bold mb-1">{integration.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {integration.description}
                </p>

                <div className="flex items-center gap-3 mb-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{integration.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3 text-muted-foreground" />
                    <span>{(integration.installs / 1000).toFixed(0)}K</span>
                  </div>
                  {integration.tier !== "free" && (
                    <Badge className="text-xs bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                      {integration.tier}
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={() => handleInstall(integration)}
                  className="w-full"
                  size="sm"
                  variant={integration.installed ? "outline" : "default"}
                >
                  {integration.installed ? "Configure" : "Install"}
                </Button>
              </Card>
            );
          })}
        </div>

        {filteredIntegrations.length === 0 && (
          <Card className="glass-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No integrations found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or browse different categories
            </p>
          </Card>
        )}
      </div>

      {/* Stats Banner */}
      <Card className="glass-card p-8 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-500/30">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">{integrations.length}+</div>
            <p className="text-muted-foreground">Integrations Available</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">250K+</div>
            <p className="text-muted-foreground">Total Installs</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.7</div>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
