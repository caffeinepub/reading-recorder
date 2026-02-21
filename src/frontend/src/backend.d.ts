import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type ClassLabel = string;
export type ParagraphNumber = bigint;
export type RecordingId = string;
export interface Recording {
    id: RecordingId;
    paragraphNumber: ParagraphNumber;
    externalBlob: ExternalBlob;
    language: Language;
    classLabel: ClassLabel;
}
export enum Language {
    hindi = "hindi",
    english = "english"
}
export interface backendInterface {
    createRecording(classLabel: ClassLabel, externalBlob: ExternalBlob, language: Language, paragraphNumber: ParagraphNumber): Promise<RecordingId>;
    deleteRecording(id: RecordingId): Promise<void>;
    getAllRecordingIds(): Promise<Array<RecordingId>>;
    getRecording(id: RecordingId): Promise<Recording>;
    getRecordingsByClass(classLabel: ClassLabel): Promise<Array<Recording>>;
    getRecordingsByClassAndLanguage(classLabel: ClassLabel, language: Language): Promise<Array<Recording>>;
    getRecordingsByLanguage(language: Language): Promise<Array<Recording>>;
    getRecordingsByParagraph(paragraphNumber: ParagraphNumber): Promise<Array<Recording>>;
}
