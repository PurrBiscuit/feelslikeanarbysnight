import { ThemeToggle } from "@/components/theme-toggle";
import { PuddyIcon } from "@/components/puddy-icon";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text-primary p-8">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center gap-8 mt-8">
        <PuddyIcon size="lg" playAudio />
        <PuddyIcon size="sm" />
        <PuddyIcon size="xs" />
      </div>
    </div>
  );
}
