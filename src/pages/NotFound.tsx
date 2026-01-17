import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout showFooter={false}>
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 text-7xl font-bold text-muted-foreground/30">404</div>
        <h1 className="mb-2 text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="mb-8 text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="gap-2 font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
