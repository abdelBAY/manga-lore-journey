
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Index from "@/pages/Index";
import MangaDetails from "@/pages/MangaDetails";
import Reader from "@/pages/Reader";
import Search from "@/pages/Search";
import Favorites from "@/pages/Favorites";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

// Auth Provider
import { AuthProvider } from "@/hooks/useAuth";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/manga/:mangaId" element={<MangaDetails />} />
            <Route path="/manga/:mangaId/chapter/:chapterId" element={<Reader />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
