import RecordingInterface from '../components/RecordingInterface';

export default function RecordingPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Create Recording</h2>
        <p className="text-muted-foreground">
          Select a class and record your reading session
        </p>
      </div>
      <RecordingInterface />
    </div>
  );
}
