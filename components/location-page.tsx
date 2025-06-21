import { Button } from "./ui/button";

export default function LocationPage({ handleQuickQuestion }: { handleQuickQuestion: (msg: string) => void }) {
  return (
    <div className="p-4 border-t bg-white">
      <p className="text-sm text-gray-600 mb-2">Try a quick question based on your location:</p>
      <Button onClick={() => handleQuickQuestion("What are top places near me?")}>
        Top spots near me
      </Button>
    </div>
  )
}
