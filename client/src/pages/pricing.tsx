import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out the platform",
    icon: Sparkles,
    popular: false,
    features: [
      "1,000 API calls/month",
      "2 API integrations",
      "Basic analytics",
      "7-day data retention",
      "Community support",
      "Mobile app access",
    ],
    limitations: [
      "No custom branding",
      "No advanced analytics",
      "No priority support",
    ],
    cta: "Get Started Free",
    gradient: "from-gray-500 to-gray-600",
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    description: "For growing teams and businesses",
    icon: Zap,
    popular: true,
    features: [
      "100,000 API calls/month",
      "Unlimited integrations",
      "Advanced analytics & insights",
      "90-day data retention",
      "Priority email support",
      "Custom branding & white-labeling",
      "Team collaboration (up to 5 users)",
      "API webhooks",
      "Export data (CSV, JSON)",
      "SLA: 99.9% uptime",
    ],
    limitations: [],
    cta: "Start 14-Day Free Trial",
    gradient: "from-yellow-500 to-yellow-600",
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "per month",
    description: "For large-scale operations",
    icon: Crown,
    popular: false,
    features: [
      "Unlimited API calls",
      "Unlimited integrations",
      "Real-time analytics & AI insights",
      "Unlimited data retention",
      "24/7 priority support + phone",
      "Full white-labeling + custom domain",
      "Unlimited team members",
      "Advanced API webhooks & automation",
      "Export + scheduled reports",
      "SLA: 99.99% uptime",
      "Dedicated account manager",
      "Custom integrations on request",
      "SSO & advanced security",
    ],
    limitations: [],
    cta: "Contact Sales",
    gradient: "from-yellow-600 to-orange-600",
  },
];

const comparisonFeatures = [
  {
    category: "API & Integrations",
    features: [
      { name: "API Calls per Month", free: "1,000", pro: "100,000", enterprise: "Unlimited" },
      { name: "API Integrations", free: "2", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Webhooks", free: false, pro: true, enterprise: true },
      { name: "Custom Integrations", free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "Analytics & Data",
    features: [
      { name: "Real-time Analytics", free: false, pro: true, enterprise: true },
      { name: "Data Retention", free: "7 days", pro: "90 days", enterprise: "Unlimited" },
      { name: "AI Insights", free: false, pro: false, enterprise: true },
      { name: "Data Export", free: false, pro: true, enterprise: true },
      { name: "Scheduled Reports", free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "Branding & Customization",
    features: [
      { name: "Custom Branding", free: false, pro: true, enterprise: true },
      { name: "White-labeling", free: false, pro: true, enterprise: true },
      { name: "Custom Domain", free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "Team & Support",
    features: [
      { name: "Team Members", free: "1", pro: "5", enterprise: "Unlimited" },
      { name: "Support", free: "Community", pro: "Priority Email", enterprise: "24/7 + Phone" },
      { name: "SLA Uptime", free: "-", pro: "99.9%", enterprise: "99.99%" },
      { name: "Dedicated Manager", free: false, pro: false, enterprise: true },
    ],
  },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [showComparison, setShowComparison] = useState(false);
  const { toast } = useToast();

  const handleSelectPlan = (planName: string) => {
    if (planName === "Free") {
      toast({
        title: "🎉 Welcome to the Free Plan!",
        description: "You can start using the platform immediately.",
      });
    } else if (planName === "Enterprise") {
      toast({
        title: "📞 Sales Team Notified",
        description: "Our team will reach out within 24 hours to discuss your needs.",
      });
    } else {
      toast({
        title: "🚀 Starting Your Free Trial",
        description: "Redirecting to checkout... Enjoy 14 days free!",
      });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black border-0">
          <Rocket className="w-3 h-3 mr-1" />
          14-Day Free Trial on Pro
        </Badge>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Scale your API management as you grow. No hidden fees, cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={billingCycle === "monthly" ? "text-foreground font-semibold" : "text-muted-foreground"}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              billingCycle === "annual" ? "bg-gradient-to-r from-yellow-500 to-yellow-600" : "bg-muted"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                billingCycle === "annual" ? "translate-x-7" : ""
              }`}
            />
          </button>
          <span className={billingCycle === "annual" ? "text-foreground font-semibold" : "text-muted-foreground"}>
            Annual
            <Badge className="ml-2 bg-green-500/20 text-green-500 border-green-500/30">Save 20%</Badge>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16 animate-slide-up">
        {pricingTiers.map((tier, index) => {
          const Icon = tier.icon;
          const adjustedPrice = billingCycle === "annual" && tier.price !== "$0"
            ? `$${Math.round(parseFloat(tier.price.slice(1)) * 0.8)}`
            : tier.price;

          return (
            <Card
              key={tier.name}
              className={`glass-card relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                tier.popular ? "border-2 border-yellow-500 shadow-2xl shadow-yellow-500/20" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="p-8">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${tier.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{adjustedPrice}</span>
                    {tier.price !== "$0" && (
                      <span className="text-muted-foreground">/{billingCycle === "annual" ? "year" : "month"}</span>
                    )}
                  </div>
                  {billingCycle === "annual" && tier.price !== "$0" && (
                    <p className="text-sm text-green-500 mt-1">
                      Save ${Math.round(parseFloat(tier.price.slice(1)) * 12 * 0.2)} per year
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(tier.name)}
                  className={`w-full mb-6 ${
                    tier.popular
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
                      : ""
                  }`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>

                {/* Features */}
                <div className="space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {tier.limitations.map((limitation) => (
                    <div key={limitation} className="flex items-start gap-2 opacity-50">
                      <span className="text-sm line-through">{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison Toggle */}
      <div className="text-center mb-8">
        <Button
          onClick={() => setShowComparison(!showComparison)}
          variant="outline"
          className="hover-elevate-gold"
        >
          {showComparison ? "Hide" : "View"} Detailed Comparison
        </Button>
      </div>

      {/* Detailed Comparison Table */}
      {showComparison && (
        <Card className="glass-card overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Features</th>
                  <th className="text-center p-4 font-semibold">Free</th>
                  <th className="text-center p-4 font-semibold bg-yellow-500/10">Pro</th>
                  <th className="text-center p-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((category) => (
                  <>
                    <tr key={category.category} className="bg-muted/30">
                      <td colSpan={4} className="p-4 font-bold text-sm uppercase tracking-wide">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature) => (
                      <tr key={feature.name} className="border-b border-border/50">
                        <td className="p-4 text-sm">{feature.name}</td>
                        <td className="p-4 text-center text-sm">
                          {typeof feature.free === "boolean" ? (
                            feature.free ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )
                          ) : (
                            feature.free
                          )}
                        </td>
                        <td className="p-4 text-center text-sm bg-yellow-500/5">
                          {typeof feature.pro === "boolean" ? (
                            feature.pro ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )
                          ) : (
                            feature.pro
                          )}
                        </td>
                        <td className="p-4 text-center text-sm">
                          {typeof feature.enterprise === "boolean" ? (
                            feature.enterprise ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )
                          ) : (
                            feature.enterprise
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              q: "Can I change plans later?",
              a: "Absolutely! You can upgrade or downgrade at any time. Changes take effect immediately.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, debit cards, and ACH transfers via Stripe.",
            },
            {
              q: "Is there a long-term contract?",
              a: "No contracts. All plans are month-to-month or annual with the option to cancel anytime.",
            },
            {
              q: "Do you offer refunds?",
              a: "Yes! We offer a 30-day money-back guarantee on all paid plans. No questions asked.",
            },
          ].map((faq) => (
            <Card key={faq.q} className="glass-card p-6 hover-elevate-gold">
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
