import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAllManga, deleteManga } from "@/lib/admin-api";
import { Manga } from "@/lib/types";
import { Edit, Trash2, PlusCircle, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { checkIsAdmin } from "@/lib/supabase";

const MangaList = () => {
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mangaToDelete, setMangaToDelete] = useState<Manga | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const loadManga = async () => {
    try {
      const data = await fetchAllManga();
      setManga(data);
    } catch (err) {
      setError("Failed to load manga. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await checkIsAdmin();
      setIsAdmin(admin);
      if (!admin) {
        navigate("/");
      } else {
        loadManga();
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleDeleteClick = (manga: Manga) => {
    setMangaToDelete(manga);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!mangaToDelete) return;
    
    try {
      const success = await deleteManga(mangaToDelete.id);
      if (success) {
        setManga(manga.filter(m => m.id !== mangaToDelete.id));
      }
    } catch (err) {
      console.error("Error deleting manga:", err);
    } finally {
      setDeleteDialogOpen(false);
      setMangaToDelete(null);
    }
  };

  if (isAdmin === null) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <AdminLayout title="Manga List">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manga List</h1>
          <Button asChild>
            <Link to="/admin/manga/new"><PlusCircle className="mr-2 h-4 w-4" /> Add New Manga</Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading manga...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : manga.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg mb-4">No manga found in the database.</p>
            <Button asChild>
              <Link to="/admin/manga/new">Add Your First Manga</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {manga.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-12 overflow-hidden rounded">
                      <img 
                        src={item.coverImage || "/placeholder.svg"} 
                        alt={item.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        By {item.author} • {item.status} • {item.releaseYear}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/admin/manga/${item.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/admin/chapters?mangaId=${item.id}`}>
                          <BookOpen className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{mangaToDelete?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default MangaList;
