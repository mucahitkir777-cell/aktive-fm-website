import { lazy, Suspense, useEffect, useState } from "react";
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
import Region from "./pages/Region";
import Maintenance from "./pages/Maintenance";

const Leistungen = lazy(() => import("./pages/Leistungen"));
const UeberUns = lazy(() => import("./pages/UeberUns"));
const Kontakt = lazy(() => import("./pages/Kontakt"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Admin = lazy(() => import("./pages/Admin"));

function AppContent() {
  const [location] = useLocation();
  const [siteStatus, setSiteStatus] = useState<"live" | "maintenance">("live");

  useEffect(() => {
    initAnalytics();
    const cleanup = initScrollDepthTracking();
    return cleanup;
  }, []);

  useEffect(() => {
    trackPageView({ route: location });
    sendInternalPageView(location);
  }, [location]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/content/pages/global")
      .then((response) => response.json())
      .then((result) => {
        if (!isMounted) return;
        if (result?.success && result.page?.content?.siteStatus === "maintenance") {
          setSiteStatus("maintenance");
        }
      })
      .catch(() => {
        if (!isMounted) return;
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!location.startsWith("/admin") && siteStatus === "maintenance") {
    return <Maintenance />;
  }

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
      <Route path="/leistungen">
        <Suspense fallback={null}>
          <Leistungen />
        </Suspense>
      </Route>
      <Route path="/ueber-uns">
        <Suspense fallback={null}>
          <UeberUns />
        </Suspense>
      </Route>
      <Route path="/kontakt">
        <Suspense fallback={null}>
          <Kontakt />
        </Suspense>
      </Route>
      <Route path="/impressum">
        <Suspense fallback={null}>
          <Impressum />
        </Suspense>
      </Route>
      <Route path="/datenschutz">
        <Suspense fallback={null}>
          <Datenschutz />
        </Suspense>
      </Route>
      <Route path="/faq">
        <Suspense fallback={null}>
          <FAQ />
        </Suspense>
      </Route>
      <Route path="/admin/dashboard">
        <Suspense fallback={null}>
          <Admin />
        </Suspense>
      </Route>
      <Route path="/admin/leads">
        <Suspense fallback={null}>
          <Admin />
        </Suspense>
      </Route>
      <Route path="/admin/settings">
        <Suspense fallback={null}>
          <Admin />
        </Suspense>
      </Route>
      <Route path="/admin/pages">
        <Suspense fallback={null}>
          <Admin />
        </Suspense>
      </Route>
      <Route path="/admin/content">
        <Suspense fallback={null}>
          <Admin />
        </Suspense>
      </Route>
      <Route path="/admin/preview">
        <Suspense fallback={null}>
          <Admin />
        </Suspense>
      </Route>
      <Route path="/admin/:section">
        <Suspense fallback={null}>
          <Admin />
        </Suspense>
      </Route>
      <Route path="/admin">
        <Suspense fallback={null}>
          <Admin />
        </Suspense>
      </Route>
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
