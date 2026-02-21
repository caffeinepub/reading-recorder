import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type OldRecording = {
    id : Text;
    classLabel : Text;
    externalBlob : Storage.ExternalBlob;
  };

  type OldActor = {
    recordingData : Map.Map<Text, OldRecording>;
    recordingCounter : Nat;
  };

  type NewRecording = {
    id : Text;
    classLabel : Text;
    externalBlob : Storage.ExternalBlob;
    language : { #hindi; #english };
    paragraphNumber : Nat;
  };

  type NewActor = {
    recordingData : Map.Map<Text, NewRecording>;
    recordingCounter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newRecordingData = old.recordingData.map<Text, OldRecording, NewRecording>(
      func(_key, oldRecording) {
        {
          oldRecording with
          language = #english;
          paragraphNumber = 1;
        };
      }
    );
    {
      old with
      recordingData = newRecordingData;
    };
  };
};
