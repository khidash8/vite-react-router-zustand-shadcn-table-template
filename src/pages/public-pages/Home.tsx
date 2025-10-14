import { Link } from "react-router";
import { Landmark } from "lucide-react";
import { Label } from "../../components/ui/label.tsx";
import { Button } from "../../components/ui/button.tsx";
import { useRbacAuthStore } from "../../features/auth/store/RbacAuthStore.ts";

const HomePage = () => {
  const { isAuthenticated } = useRbacAuthStore();

  return (
    <div className="p-4 text-center">
      <div className="flex flex-col space-y-8 items-center justify-center">
        <Landmark size={100} />

        <div className="flex flex-col space-y-2 items-center">
          <Label className={"text-3xl font-bold"}>
            Welcome to Global Trust Bank
          </Label>
          <Label className={"text-lg text-muted-foreground"}>
            Your trusted partner in financial growth and security
          </Label>
        </div>

        {!isAuthenticated && (
          <Button asChild={true}>
            <Link to="/login" className="cta-button">
              Sign In to Online Banking
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
