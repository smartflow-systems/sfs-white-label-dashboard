import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Download,
  AlertCircle,
  TrendingUp,
  Server,
  Database,
  Zap,
  Calendar,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const currentPlan = {
  name: "Pro",
  price: 49,
  billingCycle: "monthly",
  nextBillingDate: "2026-02-18",
  status: "active",
};

const usageData = {
  apiCalls: {
    used: 67543,
    limit: 100000,
    percentage: 67.5,
  },
  storage: {
    used: 8.4,
    limit: 50,
    percentage: 16.8,
  },
  bandwidth: {
    used: 142.3,
    limit: 500,
    percentage: 28.5,
  },
};

const invoices = [
  {
    id: "INV-2026-001",
    date: "2026-01-18",
    amount: 49.0,
    status: "paid",
    period: "Jan 2026",
    downloadUrl: "#",
  },
  {
    id: "INV-2025-012",
    date: "2025-12-18",
    amount: 49.0,
    status: "paid",
    period: "Dec 2025",
    downloadUrl: "#",
  },
  {
    id: "INV-2025-011",
    date: "2025-11-18",
    amount: 49.0,
    status: "paid",
    period: "Nov 2025",
    downloadUrl: "#",
  },
  {
    id: "INV-2025-010",
    date: "2025-10-18",
    amount: 0.0,
    status: "paid",
    period: "Oct 2025 (Trial)",
    downloadUrl: "#",
  },
];

const paymentMethods = [
  {
    id: "pm_1",
    type: "Visa",
    last4: "4242",
    expiry: "12/2027",
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "Mastercard",
    last4: "5555",
    expiry: "08/2026",
    isDefault: false,
  },
];

const upcomingCharges = [
  {
    description: "Pro Plan - Monthly Subscription",
    amount: 49.0,
    date: "2026-02-18",
  },
];

export default function Billing() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const handleUpgrade = () => {
    toast({
      title: "🚀 Upgrade to Enterprise",
      description: "Redirecting to checkout...",
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "📥 Downloading Invoice",
      description: `Invoice ${invoiceId} is being prepared...`,
    });
  };

  const handleUpdatePayment = () => {
    toast({
      title: "💳 Update Payment Method",
      description: "Redirecting to payment settings...",
    });
  };

  const handleCancelPlan = () => {
    toast({
      title: "⚠️ Cancel Subscription",
      description: "Are you sure? Your access will continue until the end of the billing period.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">Billing & Usage</h1>
        <p className="text-muted-foreground">
          Manage your subscription, view invoices, and track your usage
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className="glass-card p-6 border-yellow-500/30 animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge className="mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black border-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Active
            </Badge>
            <h2 className="text-2xl font-bold">{currentPlan.name} Plan</h2>
            <p className="text-muted-foreground">
              ${currentPlan.price}/{currentPlan.billingCycle}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Next billing date</p>
            <p className="font-semibold flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(currentPlan.nextBillingDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button onClick={handleUpgrade} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Upgrade to Enterprise
          </Button>
          <Button onClick={handleUpdatePayment} variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Update Payment
          </Button>
          <Button onClick={handleCancelPlan} variant="outline" className="text-red-500 hover:text-red-600">
            Cancel Plan
          </Button>
        </div>
      </Card>

      {/* Usage Overview */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Current Usage</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* API Calls */}
          <Card className="glass-card p-6 hover-elevate-gold animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">API Calls</p>
                  <p className="text-2xl font-bold">{usageData.apiCalls.used.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <Progress value={usageData.apiCalls.percentage} className="mb-2 h-2" />
            <p className="text-sm text-muted-foreground">
              {usageData.apiCalls.used.toLocaleString()} of {usageData.apiCalls.limit.toLocaleString()} calls used
              ({usageData.apiCalls.percentage}%)
            </p>
            {usageData.apiCalls.percentage > 80 && (
              <div className="flex items-center gap-2 mt-3 text-yellow-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Approaching limit</span>
              </div>
            )}
          </Card>

          {/* Storage */}
          <Card className="glass-card p-6 hover-elevate-gold animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Storage</p>
                  <p className="text-2xl font-bold">{usageData.storage.used} GB</p>
                </div>
              </div>
            </div>
            <Progress value={usageData.storage.percentage} className="mb-2 h-2" />
            <p className="text-sm text-muted-foreground">
              {usageData.storage.used} GB of {usageData.storage.limit} GB used ({usageData.storage.percentage}%)
            </p>
          </Card>

          {/* Bandwidth */}
          <Card className="glass-card p-6 hover-elevate-gold animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bandwidth</p>
                  <p className="text-2xl font-bold">{usageData.bandwidth.used} GB</p>
                </div>
              </div>
            </div>
            <Progress value={usageData.bandwidth.percentage} className="mb-2 h-2" />
            <p className="text-sm text-muted-foreground">
              {usageData.bandwidth.used} GB of {usageData.bandwidth.limit} GB used ({usageData.bandwidth.percentage}%)
            </p>
          </Card>
        </div>
      </div>

      {/* Tabs for Invoices and Payment Methods */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
        <TabsList className="grid w-full max-w-md grid-cols-3 glass-card">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Upcoming Charges */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Upcoming Charges
            </h3>
            <div className="space-y-3">
              {upcomingCharges.map((charge, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-semibold">{charge.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Due {new Date(charge.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xl font-bold">${charge.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Spending Trend */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Spending Trend
            </h3>
            <div className="flex items-end gap-2 h-40">
              {[45, 49, 49, 49, 49, 49].map((amount, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-yellow-500 to-yellow-600 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(amount / 50) * 100}%` }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {new Date(2025, 7 + index).toLocaleDateString("en-US", { month: "short" })}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold">Invoice ID</th>
                    <th className="text-left p-4 font-semibold">Period</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-left p-4 font-semibold">Amount</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-right p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-4 font-mono text-sm">{invoice.id}</td>
                      <td className="p-4">{invoice.period}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-semibold">${invoice.amount.toFixed(2)}</td>
                      <td className="p-4">
                        <Badge
                          className={
                            invoice.status === "paid"
                              ? "bg-green-500/20 text-green-500 border-green-500/30"
                              : invoice.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                              : "bg-red-500/20 text-red-500 border-red-500/30"
                          }
                        >
                          {invoice.status === "paid" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {invoice.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {invoice.status === "failed" && <XCircle className="w-3 h-3 mr-1" />}
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Payment Methods</h3>
              <Button onClick={handleUpdatePayment} variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {method.type} •••• {method.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {method.isDefault && (
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                        Default
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Billing Information */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Billing Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Company Name</p>
                <p className="font-semibold">Acme Corporation</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tax ID</p>
                <p className="font-semibold">12-3456789</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Billing Email</p>
                <p className="font-semibold">billing@acme.com</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="font-semibold">123 Business St, San Francisco, CA 94105</p>
              </div>
            </div>
            <Button onClick={handleUpdatePayment} variant="outline" className="mt-4">
              Update Billing Info
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
