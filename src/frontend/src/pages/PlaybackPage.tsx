import { useState } from 'react';
import RecordingsList from '../components/RecordingsList';
import PlaybackControls from '../components/PlaybackControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Recording } from '../backend';

export default function PlaybackPage() {
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Playback & Reading</h2>
        <p className="text-muted-foreground">
          Listen to your recorded reading sessions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecordingsList
            selectedRecording={selectedRecording}
            onSelectRecording={setSelectedRecording}
          />
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Now Playing</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRecording ? (
                <PlaybackControls recording={selectedRecording} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Select a recording to play
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
