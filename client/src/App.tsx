import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import StickyBar from "./components/StickyBar";
import CookieConsent from "./components/CookieConsent";
import CompanyMeta from "./components/CompanyMeta";
import CompanyStructuredData from "./components/CompanyStructuredData";
import { initAnalytics, initScrollDepthTracking, trackPageView } from "./lib/analytics";
import { sendInternalPageView } from "./lib/pageviews";
import { companyConfig } from "./config/company";
import Home from "./pages/Home";
import Leistungen from "./pages/Leistungen";
import UeberUns from "./pages/UeberUns";
import Kontakt from "./pages/Kontakt";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import FAQ from "./pages/FAQ";
import Region from "./pages/Region";
import Admin from "./pages/Admin";

function AppContent() {
  const [location] = useLocation();

  useEffect(() => {
    initAnalytics();
    const cleanup = initScrollDepthTracking();
    return cleanup;
  }, []);

  useEffect(() => {
    trackPageView({ route: location });
    sendInternalPageView(location);
  }, [location]);

  return (
    <>
      <Router />
      <CompanyMeta />
      <CompanyStructuredData />
      <StickyBar />
      <CookieConsent />
    </>
  );
}

function Router() {
  const regionalRegionRoutes = companyConfig.regions.map((region) => region.route);
  const regionalServiceRoutes = companyConfig.regionalServiceRoutes.map((route) => route.route);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/leistungen" component={Leistungen} />
      <Route path="/ueber-uns" component={UeberUns} />
      <Route path="/kontakt" component={Kontakt} />
      <Route path="/impressum" component={Impressum} />
      <Route path="/datenschutz" component={Datenschutz} />
      <Route path="/faq" component={FAQ} />
      <Route path="/admin/dashboard" component={Admin} />
      <Route path="/admin/leads" component={Admin} />
      <Route path="/admin/settings" component={Admin} />
      <Route path="/admin/pages" component={Admin} />
      <Route path="/admin/content" component={Admin} />
      <Route path="/admin/preview" component={Admin} />
      <Route path="/admin/:section" component={Admin} />
      <Route path="/admin" component={Admin} />
      {regionalRegionRoutes.map((path) => (
        <Route key={path} path={path} component={Region} />
      ))}
      {regionalServiceRoutes.map((path) => (
        <Route key={path} path={path} component={Region} />
      ))}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
