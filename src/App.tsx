
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

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import MangaList from "@/pages/admin/MangaList";
import MangaForm from "@/pages/admin/MangaForm";
import ChapterList from "@/pages/admin/ChapterList";
import ChapterForm from "@/pages/admin/ChapterForm";
import AdminSettings from "@/pages/admin/AdminSettings";

// Auth Provider
import { AuthProvider } from "@/hooks/auth/useAuth";

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
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/manga/:mangaId" element={<MangaDetails />} />
            <Route path="/manga/:mangaId/chapter/:chapterId" element={<Reader />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/manga" element={<MangaList />} />
            <Route path="/admin/manga/:id" element={<MangaForm />} />
            <Route path="/admin/manga/new" element={<MangaForm />} />
            <Route path="/admin/chapters" element={<ChapterList />} />
            <Route path="/admin/chapters/:id" element={<ChapterForm />} />
            <Route path="/admin/chapters/new" element={<ChapterForm />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
