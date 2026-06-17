import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Disclaimer from "./pages/Disclaimer";
import CookiePolicy from "./pages/CookiePolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import { useFirebaseAuth } from "./hooks/useFirebaseAuth";
import { Spinner } from "./components/ui/spinner";
import "@/lib/firebase";

function Router() {
  const { user, loading } = useFirebaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  // Redirect authenticated users away from login/signup
  if (user) {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsAndConditions} />
        <Route path="/disclaimer" component={Disclaimer} />
        <Route path="/cookies" component={CookiePolicy} />
        <Route path="/refund" component={RefundPolicy} />
        <Route path="/contact" component={ContactUs} />
        <Route path="/about" component={AboutUs} />
        <Route path="/404" component={NotFound} />
        {/* Redirect login/signup to home for authenticated users */}
        <Route path="/login" component={Home} />
        <Route path="/signup" component={Home} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Show login/signup for unauthenticated users
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsAndConditions} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/cookies" component={CookiePolicy} />
      <Route path="/refund" component={RefundPolicy} />
      <Route path="/contact" component={ContactUs} />
      <Route path="/about" component={AboutUs} />
      <Route path="/" component={Login} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
