"use client";

import { Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { IntegrationsTabProps } from "@/lib/types";

const IntegrationsTab = ({ client }: IntegrationsTabProps) => {
  const [googleApiKey, setGoogleApiKey] = useState("GA-XXXX-XXXX-XXXX-XXXX");
  const [metaApiKey, setMetaApiKey] = useState("GA-XXXX-XXXX-XXXX-XXXX");
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showMetaKey, setShowMetaKey] = useState(false);
  const [autoSync, setAutoSync] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 sm:mt-4 -mx-4 sm:mx-0 px-4 sm:px-0">
      {/* API Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className ="py-2 text-md">API Configuration</CardTitle>
            <Button size="sm" className="text-xs p-2 m-2 bg-[#3072C0] text-white rounded-xl h-10 w-36" >
              Test Connections
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Analytics API Key */}
          <div className="space-y-2">
            <Label htmlFor="google-api">Google Analytics API Key</Label>
            <div className="relative">
              <Input
                id="google-api"
                type={showGoogleKey ? "text" : "password"}
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                className="pr-20 bg-background"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGoogleKey(!showGoogleKey)}
                  className="h-6 w-6 p-0"
                >
                  {showGoogleKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(googleApiKey)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">Connected</span>
            </div>
          </div>

          {/* Meta Analytics API Key */}
          <div className="space-y-2">
            <Label htmlFor="meta-api">Meta Analytics API Key</Label>
            <div className="relative">
              <Input
                id="meta-api"
                type={showMetaKey ? "text" : "password"}
                value={metaApiKey}
                onChange={(e) => setMetaApiKey(e.target.value)}
                className="pr-20 bg-background"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMetaKey(!showMetaKey)}
                  className="h-6 w-6 p-0"
                >
                  {showMetaKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(metaApiKey)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-red-600">Disconnected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Synchronization */}
      <Card>
        <CardHeader>
          <CardTitle className="py-2 text-md">Synchronization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto Sync */}
          <div className="border border-border rounded-lg p-4 bg-background">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-sync">Auto Sync</Label>
                <p className="text-sm text-muted-foreground">Automatically sync data every hour</p>
              </div>
              <Switch
                id="auto-sync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>
          </div>

          {/* Sync Schedule */}
          <div className="space-y-2">
            <Label htmlFor="sync-schedule">Sync Schedule</Label>
            <Select defaultValue="every-hour">
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="every-15-minutes">Every 15 minutes</SelectItem>
                <SelectItem value="every-30-minutes">Every 30 minutes</SelectItem>
                <SelectItem value="every-hour">Every hour</SelectItem>
                <SelectItem value="every-2-hours">Every 2 hours</SelectItem>
                <SelectItem value="every-6-hours">Every 6 hours</SelectItem>
                <SelectItem value="every-12-hours">Every 12 hours</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sync Status */}
          <div className="border border-border rounded-lg p-4 bg-background">
            <div className="flex items-center justify-between">
              <Label>Last Sync</Label>
              <span className="text-sm text-muted-foreground">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <Label>Next Sync</Label>
              <span className="text-sm text-muted-foreground">in 58 minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsTab;
