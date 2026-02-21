import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  include MixinStorage();

  type RecordingId = Text;
  type ClassLabel = Text;

  type Recording = {
    id : RecordingId;
    classLabel : ClassLabel;
    externalBlob : Storage.ExternalBlob;
  };

  let recordingData = Map.empty<RecordingId, Recording>();
  var recordingCounter = 0;

  public shared ({ caller }) func createRecording(classLabel : ClassLabel, externalBlob : Storage.ExternalBlob) : async RecordingId {
    recordingCounter += 1;
    let recordingId = "rec_" # classLabel # "_" # recordingCounter.toText();
    let recording = {
      id = recordingId;
      classLabel;
      externalBlob;
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
