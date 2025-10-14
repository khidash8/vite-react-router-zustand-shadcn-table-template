import { Label } from "../components/ui/label.tsx";

export const NotFound = () => (
  <div className="w-full relative h-[calc(100vh-64px)] flex flex-col items-center justify-center">
    <div className="flex flex-col space-y-2 items-center z-10">
      <Label className={"text-3xl font-bold"}>404 - Page Not Found</Label>
      <Label className={"text-lg text-muted-foreground"}>
        The page you're looking for doesn't exist.
      </Label>
    </div>
  </div>
);
