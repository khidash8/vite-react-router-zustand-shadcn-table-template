import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { Lock } from "lucide-react";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full relative h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col space-y-6 items-center z-10 text-center max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-destructive/10 rounded-full">
            <Lock className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2 flex flex-col items-center justify-center">
            <Label className="text-3xl font-bold">Access Denied</Label>
            <Label className="text-lg text-muted-foreground block">
              You don't have the required permissions to access this page.
              Please contact your administrator if you need access.
            </Label>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className={"cursor-pointer"}
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="default"
            className={"cursor-pointer"}
          >
            Home Page
          </Button>
        </div>
      </div>
    </div>
  );
};
