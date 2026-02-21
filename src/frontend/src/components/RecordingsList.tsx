import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetAllRecordings, useGetRecordingsByLanguage, useGetRecordingsByParagraph, useDeleteRecording } from '../hooks/useQueries';
import { Trash2, PlayCircle, Loader2 } from 'lucide-react';
import type { Recording } from '../backend';
import { Language } from '../backend';
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
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [paragraphFilter, setParagraphFilter] = useState<string>('');
  const [recordingToDelete, setRecordingToDelete] = useState<string | null>(null);
  
  const { data: allRecordings, isLoading: isLoadingAll } = useGetAllRecordings();
  const { data: hindiRecordings, isLoading: isLoadingHindi } = useGetRecordingsByLanguage(Language.hindi);
  const { data: englishRecordings, isLoading: isLoadingEnglish } = useGetRecordingsByLanguage(Language.english);
  const paragraphNum = paragraphFilter ? BigInt(paragraphFilter) : null;
  const { data: paragraphRecordings, isLoading: isLoadingParagraph } = useGetRecordingsByParagraph(paragraphNum);
  
  const deleteRecording = useDeleteRecording();

  const handleDelete = async () => {
    if (recordingToDelete) {
      await deleteRecording.mutateAsync(recordingToDelete);
      if (selectedRecording?.id === recordingToDelete) {
        onSelectRecording(null as any);
      }
      setRecordingToDelete(null);
    }
  };

  const getFilteredRecordings = () => {
    let recordings = allRecordings || [];

    // Apply language filter
    if (languageFilter === 'hindi') {
      recordings = hindiRecordings || [];
    } else if (languageFilter === 'english') {
      recordings = englishRecordings || [];
    }

    // Apply paragraph filter
    if (paragraphFilter && paragraphRecordings) {
      const paragraphIds = new Set(paragraphRecordings.map(r => r.id));
      recordings = recordings.filter(r => paragraphIds.has(r.id));
    }

    return recordings;
  };

  const getRecordingsByClass = (classLabel: string) => {
    const filtered = getFilteredRecordings();
    return filtered.filter((rec) => rec.classLabel === classLabel);
  };

  const getLanguageBadgeColor = (language: Language) => {
    return language === Language.hindi 
      ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20' 
      : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
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
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-sm truncate">{recording.id}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs text-muted-foreground">Class {recording.classLabel}</p>
              <Badge variant="outline" className={`text-xs ${getLanguageBadgeColor(recording.language)}`}>
                {recording.language === Language.hindi ? 'Hindi' : 'English'}
              </Badge>
              <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20">
                Para {recording.paragraphNumber.toString()}
              </Badge>
            </div>
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

  const isLoading = isLoadingAll || isLoadingHindi || isLoadingEnglish || isLoadingParagraph;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const filteredRecordings = getFilteredRecordings();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Recordings</CardTitle>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="language-filter">Filter by Language</Label>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger id="language-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paragraph-filter">Filter by Paragraph</Label>
              <Input
                id="paragraph-filter"
                type="number"
                min="1"
                value={paragraphFilter}
                onChange={(e) => setParagraphFilter(e.target.value)}
                placeholder="All paragraphs"
              />
            </div>
          </div>
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
                {filteredRecordings && filteredRecordings.length > 0 ? (
                  <div className="space-y-2">
                    {filteredRecordings.map(renderRecordingItem)}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    {allRecordings && allRecordings.length > 0 
                      ? 'No recordings match the selected filters.'
                      : 'No recordings yet. Start recording to see them here.'}
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
                      {allRecordings && allRecordings.length > 0 
                        ? `No recordings for Class ${classNum} match the selected filters.`
                        : `No recordings for Class ${classNum}`}
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
