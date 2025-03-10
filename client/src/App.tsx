import * as React from "react";
import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

// This is a custom hook to handle the GitHub Pages base path
const useHashLocation = () => {
  const [currentHash, setCurrentHash] = React.useState(
    window.location.hash.replace("#", "") || "/"
  );

  React.useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "") || "/";
      setCurrentHash(newHash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = React.useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  return [currentHash, navigate] as [string, (to: string) => void];
};

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
