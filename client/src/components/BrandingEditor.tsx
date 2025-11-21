import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Upload, Palette, Type, Eye, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrandingSettings {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  companyName: string;
}

interface BrandingEditorProps {
  tenantId?: string;
  initialSettings?: Partial<BrandingSettings>;
  onSave?: (settings: BrandingSettings) => Promise<void>;
}

const FONT_OPTIONS = [
  { value: "inter", label: "Inter (Default)" },
  { value: "roboto", label: "Roboto" },
  { value: "open-sans", label: "Open Sans" },
  { value: "lato", label: "Lato" },
  { value: "montserrat", label: "Montserrat" },
  { value: "poppins", label: "Poppins" },
  { value: "raleway", label: "Raleway" },
];

const SFS_THEME = {
  gold: "#FFD700",
  brown: "#3B2F2F",
  black: "#0D0D0D",
  lightGold: "#FFF8DC",
};

export function BrandingEditor({ tenantId, initialSettings, onSave }: BrandingEditorProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(initialSettings?.logo);

  const [settings, setSettings] = useState<BrandingSettings>({
    logo: initialSettings?.logo,
    primaryColor: initialSettings?.primaryColor || SFS_THEME.gold,
    secondaryColor: initialSettings?.secondaryColor || SFS_THEME.brown,
    accentColor: initialSettings?.accentColor || SFS_THEME.black,
    fontFamily: initialSettings?.fontFamily || "inter",
    companyName: initialSettings?.companyName || "",
  });

  const handleColorChange = (field: keyof BrandingSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file (PNG, JPG, SVG)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Logo must be less than 2MB",
          variant: "destructive",
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setSettings((prev) => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(settings);
      } else {
        // Default save to API
        const response = await fetch("/api/tenants/current", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logo: settings.logo,
            primaryColor: settings.primaryColor,
            secondaryColor: settings.secondaryColor,
            accentColor: settings.accentColor,
            name: settings.companyName,
          }),
        });

        if (!response.ok) throw new Error("Failed to save branding");
      }

      toast({
        title: "Branding Updated",
        description: "Your branding settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save branding settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetToSFSTheme = () => {
    setSettings((prev) => ({
      ...prev,
      primaryColor: SFS_THEME.gold,
      secondaryColor: SFS_THEME.brown,
      accentColor: SFS_THEME.black,
    }));
    toast({
      title: "Theme Reset",
      description: "Colors reset to SFS default theme",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colors">
            <Palette className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="logo">
            <Upload className="h-4 w-4 mr-2" />
            Logo
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="h-4 w-4 mr-2" />
            Typography
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>
                Customize your brand colors. These will be applied across your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                      className="flex-1 font-mono"
                      placeholder="#FFD700"
                    />
                  </div>
                  <div
                    className="h-12 rounded-md border"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                      className="flex-1 font-mono"
                      placeholder="#3B2F2F"
                    />
                  </div>
                  <div
                    className="h-12 rounded-md border"
                    style={{ backgroundColor: settings.secondaryColor }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => handleColorChange("accentColor", e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) => handleColorChange("accentColor", e.target.value)}
                      className="flex-1 font-mono"
                      placeholder="#0D0D0D"
                    />
                  </div>
                  <div
                    className="h-12 rounded-md border"
                    style={{ backgroundColor: settings.accentColor }}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={resetToSFSTheme}>
                  Reset to SFS Theme
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Logo</CardTitle>
              <CardDescription>
                Upload your company logo. Recommended size: 200x50px, max 2MB.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => setSettings((prev) => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Enter your company name"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 hover:border-primary transition-colors">
                  {logoPreview ? (
                    <div className="space-y-4">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="max-h-24 max-w-full object-contain"
                      />
                      <div className="flex gap-2">
                        <label htmlFor="logo-upload">
                          <Button variant="outline" size="sm" asChild>
                            <span className="cursor-pointer">Change Logo</span>
                          </Button>
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setLogoPreview(undefined);
                            setSettings((prev) => ({ ...prev, logo: undefined }));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload logo
                      </span>
                      <span className="text-xs text-muted-foreground">
                        PNG, JPG, SVG (max 2MB)
                      </span>
                    </label>
                  )}
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Select the font family for your dashboard text.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select
                  value={settings.fontFamily}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, fontFamily: value }))}
                >
                  <SelectTrigger id="fontFamily">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Preview</Label>
                <div
                  className="p-6 border rounded-lg"
                  style={{ fontFamily: settings.fontFamily }}
                >
                  <h3 className="text-2xl font-bold mb-2">Heading Example</h3>
                  <p className="text-base mb-4">
                    This is a preview of how your text will look with the selected font family.
                    The quick brown fox jumps over the lazy dog.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Small text: 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Preview
          </CardTitle>
          <CardDescription>
            Preview how your branding will look across the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border rounded-lg p-6 space-y-4"
            style={{
              backgroundColor: "#ffffff",
              fontFamily: settings.fontFamily,
            }}
          >
            <div className="flex items-center gap-3">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-8 object-contain" />
              ) : (
                <div className="h-8 w-32 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                  Your Logo
                </div>
              )}
              {settings.companyName && (
                <span className="text-lg font-semibold">{settings.companyName}</span>
              )}
            </div>

            <div className="space-y-2">
              <Button
                style={{
                  backgroundColor: settings.primaryColor,
                  color: "#ffffff",
                }}
                className="w-full"
              >
                Primary Button
              </Button>
              <Button
                variant="outline"
                style={{
                  borderColor: settings.secondaryColor,
                  color: settings.secondaryColor,
                }}
                className="w-full"
              >
                Secondary Button
              </Button>
            </div>

            <div
              className="p-4 rounded-md"
              style={{
                backgroundColor: settings.accentColor,
                color: "#ffffff",
              }}
            >
              <p className="text-sm">Accent color showcase</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Branding"}
        </Button>
      </div>
    </div>
  );
}
