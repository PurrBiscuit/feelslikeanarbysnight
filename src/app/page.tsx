import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text-primary p-8">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <h1 className="text-accent-red text-4xl font-display mt-4">
        FEELS LIKE AN ARBY&apos;S NIGHT
      </h1>
      <p className="text-text-secondary">Toggle dark/light mode above</p>
    </div>
  );
}
