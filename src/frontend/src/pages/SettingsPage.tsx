import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '../hooks/useSettings';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Configure your recording and playback preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Recording Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Recording Settings</CardTitle>
            <CardDescription>Configure audio recording quality and options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bitrate">Audio Bitrate</Label>
              <Select
                value={settings.bitrate.toString()}
                onValueChange={(value) => updateSettings({ bitrate: parseInt(value) })}
              >
                <SelectTrigger id="bitrate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="64000">64 kbps (Low)</SelectItem>
                  <SelectItem value="128000">128 kbps (Standard)</SelectItem>
                  <SelectItem value="192000">192 kbps (High)</SelectItem>
                  <SelectItem value="256000">256 kbps (Very High)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sampleRate">Sample Rate</Label>
              <Select
                value={settings.sampleRate.toString()}
                onValueChange={(value) => updateSettings({ sampleRate: parseInt(value) })}
              >
                <SelectTrigger id="sampleRate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="22050">22.05 kHz</SelectItem>
                  <SelectItem value="44100">44.1 kHz (CD Quality)</SelectItem>
                  <SelectItem value="48000">48 kHz (Professional)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Storage Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Settings</CardTitle>
            <CardDescription>Manage your recording storage and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoDelete">Auto-delete old recordings</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically remove recordings older than 30 days
                </p>
              </div>
              <Switch
                id="autoDelete"
                checked={settings.autoDelete}
                onCheckedChange={(checked) => updateSettings({ autoDelete: checked })}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Maximum Storage (MB)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.maxStorage]}
                  onValueChange={([value]) => updateSettings({ maxStorage: value })}
                  min={100}
                  max={5000}
                  step={100}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-20 text-right">
                  {settings.maxStorage} MB
                </span>
              </div>
            </div>

            <Separator />

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Clearing all data will permanently delete all recordings. This action cannot be undone.
              </AlertDescription>
            </Alert>

            <Button variant="destructive" className="w-full">
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        {/* Playback Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Playback Settings</CardTitle>
            <CardDescription>Customize your listening experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Playback Speed</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.playbackSpeed]}
                  onValueChange={([value]) => updateSettings({ playbackSpeed: value })}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-16 text-right">
                  {settings.playbackSpeed.toFixed(1)}x
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoPlay">Auto-play next recording</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start the next recording when one finishes
                </p>
              </div>
              <Switch
                id="autoPlay"
                checked={settings.autoPlayNext}
                onCheckedChange={(checked) => updateSettings({ autoPlayNext: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Reset Settings */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
