import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useCreateRecording } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const CLASS_OPTIONS = [
  { value: '2', label: 'Class 2' },
  { value: '3', label: 'Class 3' },
  { value: '4', label: 'Class 4' },
  { value: '5', label: 'Class 5' },
  { value: '6', label: 'Class 6' },
  { value: '7', label: 'Class 7' },
];

export default function RecordingInterface() {
  const [selectedClass, setSelectedClass] = useState<string>('2');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { isRecording, duration, error: recorderError, startRecording, stopRecording } = useAudioRecorder();
  const createRecording = useCreateRecording();

  const handleStartRecording = async () => {
    setShowSuccess(false);
    await startRecording();
  };

  const handleStopRecording = async () => {
    const audioBlob = await stopRecording();
    if (audioBlob) {
      try {
        // Create a new ArrayBuffer and copy the data to ensure proper type
        const buffer = new ArrayBuffer(audioBlob.length);
        const view = new Uint8Array(buffer);
        view.set(audioBlob);
        
        const externalBlob = ExternalBlob.fromBytes(view).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
        
        await createRecording.mutateAsync({
          classLabel: selectedClass,
          externalBlob,
        });
        
        setShowSuccess(true);
        setUploadProgress(0);
        setTimeout(() => setShowSuccess(false), 5000);
      } catch (error) {
        console.error('Failed to save recording:', error);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Class Selection */}
          <div className="space-y-2">
            <Label htmlFor="class-select">Select Class (2-7)</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass} disabled={isRecording}>
              <SelectTrigger id="class-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLASS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recording Button */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <Button
                size="lg"
                variant={isRecording ? 'destructive' : 'default'}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={createRecording.isPending}
                className={`w-32 h-32 rounded-full transition-all ${
                  isRecording ? 'animate-pulse bg-recording hover:bg-recording/90' : 'bg-recording hover:bg-recording/90'
                }`}
              >
                {createRecording.isPending ? (
                  <Loader2 className="w-12 h-12 animate-spin text-recording-foreground" />
                ) : isRecording ? (
                  <Square className="w-12 h-12 text-recording-foreground" />
                ) : (
                  <Mic className="w-12 h-12 text-recording-foreground" />
                )}
              </Button>
              
              {isRecording && (
                <div className="absolute -inset-4 rounded-full border-4 border-recording animate-ping opacity-20" />
              )}
            </div>

            {/* Duration Display */}
            {isRecording && (
              <div className="mt-6 text-center">
                <div className="text-4xl font-bold text-foreground tabular-nums">
                  {formatDuration(duration)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Recording in progress...</p>
              </div>
            )}

            {!isRecording && duration === 0 && (
              <p className="mt-6 text-muted-foreground">
                Click the microphone to start recording
              </p>
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <Alert className="bg-success/10 border-success">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                Recording saved successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Error Messages */}
          {(recorderError || createRecording.isError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {recorderError || 'Failed to save recording. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
