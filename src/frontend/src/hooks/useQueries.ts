import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Recording, RecordingId, ClassLabel, ExternalBlob, Language, ParagraphNumber } from '../backend';

export function useGetAllRecordings() {
  const { actor, isFetching } = useActor();

  return useQuery<Recording[]>({
    queryKey: ['recordings'],
    queryFn: async () => {
      if (!actor) return [];
      const ids = await actor.getAllRecordingIds();
      const recordings = await Promise.all(
        ids.map((id) => actor.getRecording(id))
      );
      return recordings;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecordingsByClass(classLabel: ClassLabel) {
  const { actor, isFetching } = useActor();

  return useQuery<Recording[]>({
    queryKey: ['recordings', 'class', classLabel],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecordingsByClass(classLabel);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecordingsByLanguage(language: Language) {
  const { actor, isFetching } = useActor();

  return useQuery<Recording[]>({
    queryKey: ['recordings', 'language', language],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecordingsByLanguage(language);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecordingsByParagraph(paragraphNumber: ParagraphNumber | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Recording[]>({
    queryKey: ['recordings', 'paragraph', paragraphNumber?.toString()],
    queryFn: async () => {
      if (!actor || paragraphNumber === null) return [];
      return actor.getRecordingsByParagraph(paragraphNumber);
    },
    enabled: !!actor && !isFetching && paragraphNumber !== null,
  });
}

export function useGetRecordingsByClassAndLanguage(classLabel: ClassLabel, language: Language) {
  const { actor, isFetching } = useActor();

  return useQuery<Recording[]>({
    queryKey: ['recordings', 'class', classLabel, 'language', language],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecordingsByClassAndLanguage(classLabel, language);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRecording() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classLabel,
      externalBlob,
      language,
      paragraphNumber,
    }: {
      classLabel: ClassLabel;
      externalBlob: ExternalBlob;
      language: Language;
      paragraphNumber: ParagraphNumber;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createRecording(classLabel, externalBlob, language, paragraphNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordings'] });
    },
  });
}

export function useDeleteRecording() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: RecordingId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteRecording(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordings'] });
    },
  });
}
