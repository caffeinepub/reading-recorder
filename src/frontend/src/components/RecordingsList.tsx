import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetAllRecordings, useDeleteRecording } from '../hooks/useQueries';
import { Trash2, PlayCircle, Loader2 } from 'lucide-react';
import type { Recording } from '../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RecordingsListProps {
  selectedRecording: Recording | null;
  onSelectRecording: (recording: Recording) => void;
}

export default function RecordingsList({ selectedRecording, onSelectRecording }: RecordingsListProps) {
  const { data: recordings, isLoading } = useGetAllRecordings();
  const deleteRecording = useDeleteRecording();
  const [recordingToDelete, setRecordingToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (recordingToDelete) {
      await deleteRecording.mutateAsync(recordingToDelete);
      if (selectedRecording?.id === recordingToDelete) {
        onSelectRecording(null as any);
      }
      setRecordingToDelete(null);
    }
  };

  const getRecordingsByClass = (classLabel: string) => {
    return recordings?.filter((rec) => rec.classLabel === classLabel) || [];
  };

  const renderRecordingItem = (recording: Recording) => {
    const isSelected = selectedRecording?.id === recording.id;
    
    return (
      <div
        key={recording.id}
        className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
          isSelected
            ? 'bg-playback/20 border-playback'
            : 'hover:bg-accent border-transparent'
        }`}
        onClick={() => onSelectRecording(recording)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <PlayCircle className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-playback' : 'text-muted-foreground'}`} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{recording.id}</p>
            <p className="text-xs text-muted-foreground">Class {recording.classLabel}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setRecordingToDelete(recording.id);
          }}
          className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Recordings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">All</TabsTrigger>
              {['2', '3', '4', '5', '6', '7'].map((classNum) => (
                <TabsTrigger key={classNum} value={classNum}>
                  {classNum}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <ScrollArea className="h-[500px] pr-4">
                {recordings && recordings.length > 0 ? (
                  <div className="space-y-2">
                    {recordings.map(renderRecordingItem)}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No recordings yet. Start recording to see them here.
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {['2', '3', '4', '5', '6', '7'].map((classNum) => (
              <TabsContent key={classNum} value={classNum} className="mt-4">
                <ScrollArea className="h-[500px] pr-4">
                  {getRecordingsByClass(classNum).length > 0 ? (
                    <div className="space-y-2">
                      {getRecordingsByClass(classNum).map(renderRecordingItem)}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No recordings for Class {classNum}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={!!recordingToDelete} onOpenChange={() => setRecordingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recording</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recording? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
