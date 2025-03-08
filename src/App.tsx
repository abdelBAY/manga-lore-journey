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
import GiveAccess from "@/pages/GiveAccess";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import MangaList from "@/pages/admin/MangaList";
import MangaForm from "@/pages/admin/MangaForm";
import ChapterList from "@/pages/admin/ChapterList";
import ChapterForm from "@/pages/admin/ChapterForm";
import AdminSettings from "@/pages/admin/AdminSettings";

// Auth Provider and Protected Route
import { AuthProvider } from "@/hooks/auth/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
            <Route path="/auth" element={<Auth />} />
            <Route path="/give-access" element={<GiveAccess />} />
            
            {/* Protected Routes */}
            <Route path="/favorites" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - Now with requireAdmin prop */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/manga" element={
              <ProtectedRoute requireAdmin={true}>
                <MangaList />
              </ProtectedRoute>
            } />
            <Route path="/admin/manga/:id" element={
              <ProtectedRoute requireAdmin={true}>
                <MangaForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/manga/new" element={
              <ProtectedRoute requireAdmin={true}>
                <MangaForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/chapters" element={
              <ProtectedRoute requireAdmin={true}>
                <ChapterList />
              </ProtectedRoute>
            } />
            <Route path="/admin/chapters/:id" element={
              <ProtectedRoute requireAdmin={true}>
                <ChapterForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/chapters/new" element={
              <ProtectedRoute requireAdmin={true}>
                <ChapterForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminSettings />
              </ProtectedRoute>
            } />
            
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
