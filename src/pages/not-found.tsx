import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full relative h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col space-y-4 items-center z-10 text-center">
        <div className="space-y-2">
          <Label className="text-3xl font-bold">404 - Page Not Found</Label>
          <Label className="text-lg text-muted-foreground block">
            The page you're looking for doesn't exist.
          </Label>
        </div>
        <Button
          onClick={() => navigate("/")}
          variant="default"
          className="cursor-pointer"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};
