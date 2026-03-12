export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text-primary p-8">
      <h1 className="text-accent-red text-4xl font-display">TOKEN TEST</h1>
      <p className="text-text-secondary">Secondary text works</p>
      <div className="bg-surface-elevated p-4 rounded border border-border mt-4">
        Surface elevated card
      </div>
      <div className="bg-surface p-4 rounded mt-4">Surface card</div>
    </div>
  );
}
