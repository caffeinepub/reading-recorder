import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { Play, Pause, Loader2 } from 'lucide-react';
import type { Recording } from '../backend';

interface PlaybackControlsProps {
  recording: Recording;
}

export default function PlaybackControls({ recording }: PlaybackControlsProps) {
  const {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    play,
    pause,
    seek,
  } = useAudioPlayer(recording.externalBlob);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  return (
    <div className="space-y-6">
      {/* Recording Info */}
      <div className="text-center">
        <h3 className="font-semibold text-lg truncate">{recording.id}</h3>
        <p className="text-sm text-muted-foreground">Class {recording.classLabel}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          disabled={isLoading || !duration}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Play/Pause Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={isPlaying ? pause : play}
          disabled={isLoading}
          className="w-20 h-20 rounded-full bg-playback hover:bg-playback/90"
        >
          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin text-playback-foreground" />
          ) : isPlaying ? (
            <Pause className="w-8 h-8 text-playback-foreground" />
          ) : (
            <Play className="w-8 h-8 text-playback-foreground ml-1" />
          )}
        </Button>
      </div>
    </div>
  );
}
