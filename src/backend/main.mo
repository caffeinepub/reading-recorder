import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type RecordingId = Text;
  type ClassLabel = Text;
  type Language = { #hindi; #english };
  type ParagraphNumber = Nat;

  // New Recording type including language and paragraph
  type Recording = {
    id : RecordingId;
    classLabel : ClassLabel;
    externalBlob : Storage.ExternalBlob;
    language : Language;
    paragraphNumber : ParagraphNumber;
  };

  let recordingData = Map.empty<RecordingId, Recording>();
  var recordingCounter = 0;

  public shared ({ caller }) func createRecording(
    classLabel : ClassLabel,
    externalBlob : Storage.ExternalBlob,
    language : Language,
    paragraphNumber : ParagraphNumber,
  ) : async RecordingId {
    recordingCounter += 1;
    let recordingId = "rec_" # classLabel # "_" # recordingCounter.toText();
    let recording = {
      id = recordingId;
      classLabel;
      externalBlob;
      language;
      paragraphNumber;
    };

    recordingData.add(recordingId, recording);
    recordingId;
  };

  public query ({ caller }) func getRecording(id : RecordingId) : async Recording {
    switch (recordingData.get(id)) {
      case (null) { Runtime.trap("Recording not found") };
      case (?recording) { recording };
    };
  };

  public query ({ caller }) func getRecordingsByClass(classLabel : ClassLabel) : async [Recording] {
    recordingData.values().toArray().filter(func(rec) { rec.classLabel == classLabel });
  };

  public query ({ caller }) func getRecordingsByLanguage(language : Language) : async [Recording] {
    recordingData.values().toArray().filter(func(rec) { rec.language == language });
  };

  public query ({ caller }) func getRecordingsByParagraph(paragraphNumber : ParagraphNumber) : async [Recording] {
    recordingData.values().toArray().filter(func(rec) { rec.paragraphNumber == paragraphNumber });
  };

  public query ({ caller }) func getRecordingsByClassAndLanguage(classLabel : ClassLabel, language : Language) : async [Recording] {
    recordingData.values().toArray().filter(
      func(rec) {
        rec.classLabel == classLabel and rec.language == language
      }
    );
  };

  public shared ({ caller }) func deleteRecording(id : RecordingId) : async () {
    if (not recordingData.containsKey(id)) {
      Runtime.trap("Recording not found");
    };
    recordingData.remove(id);
  };

  public query ({ caller }) func getAllRecordingIds() : async [RecordingId] {
    recordingData.keys().toArray();
  };
};
