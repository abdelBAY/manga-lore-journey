import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchChaptersByMangaId, deleteChapter, fetchAllManga } from "@/lib/admin-api";
import { Chapter, Manga } from "@/lib/types";
import { Edit, Trash2, PlusCircle, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { checkIsAdmin } from "@/lib/supabase";
import { format } from "date-fns";

const ChapterList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  const searchParams = new URLSearchParams(location.search);
  const queryMangaId = searchParams.get('mangaId');
  const [selectedMangaId, setSelectedMangaId] = useState<string | null>(queryMangaId);
  
  const currentManga = manga.find(m => m.id === selectedMangaId);

  const loadManga = async () => {
    try {
      const data = await fetchAllManga();
      setManga(data);
      return data;
    } catch (err) {
      setError("Failed to load manga list.");
      console.error(err);
      return [];
    }
  };

  const loadChapters = async (mangaId: string) => {
    setLoading(true);
    try {
      const data = await fetchChaptersByMangaId(mangaId);
      setChapters(data);
      setError(null);
    } catch (err) {
      setError("Failed to load chapters. Please try again.");
      console.error(err);
      setChapters([]);
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
        const mangaList = await loadManga();
        
        if (queryMangaId) {
          const exists = mangaList.some(m => m.id === queryMangaId);
          if (exists) {
            setSelectedMangaId(queryMangaId);
            loadChapters(queryMangaId);
          } else {
            setSelectedMangaId(null);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    };

    checkAdmin();
  }, [navigate, queryMangaId]);

  const handleMangaChange = (mangaId: string) => {
    setSelectedMangaId(mangaId);
    navigate(`/admin/chapters?mangaId=${mangaId}`);
    loadChapters(mangaId);
  };

  const handleDeleteClick = (chapter: Chapter) => {
    setChapterToDelete(chapter);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!chapterToDelete) return;
    
    try {
      const success = await deleteChapter(chapterToDelete.id);
      if (success) {
        setChapters(chapters.filter(c => c.id !== chapterToDelete.id));
        toast({
          title: "Success",
          description: "Chapter deleted successfully.",
        });
      }
    } catch (err) {
      console.error("Error deleting chapter:", err);
      toast({
        title: "Error",
        description: "Failed to delete chapter.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setChapterToDelete(null);
    }
  };

  if (isAdmin === null) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <AdminLayout title="Chapter List">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold">Chapters</h1>
            {currentManga && (
              <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded-md">
                {currentManga.title}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            {currentManga && (
              <Button variant="outline" asChild>
                <Link to="/admin/chapters">
                  <ArrowLeft className="mr-2 h-4 w-4" /> All Manga
                </Link>
              </Button>
            )}
            
            <Button asChild disabled={!selectedMangaId}>
              <Link to={selectedMangaId ? `/admin/chapters/new?mangaId=${selectedMangaId}` : "#"}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Chapter
              </Link>
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-1">
              <label className="text-sm font-medium">Select Manga</label>
              <Select
                value={selectedMangaId || ""}
                onValueChange={handleMangaChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a manga to manage chapters" />
                </SelectTrigger>
                <SelectContent>
                  {manga.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {!selectedMangaId ? (
          <div className="text-center py-10">
            <p className="text-lg mb-4">Select a manga to manage its chapters.</p>
          </div>
        ) : loading ? (
          <div className="text-center py-10">Loading chapters...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : chapters.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg mb-4">No chapters found for this manga.</p>
            <Button asChild>
              <Link to={`/admin/chapters/new?mangaId=${selectedMangaId}`}>Add Your First Chapter</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {chapters.map((chapter) => (
              <Card key={chapter.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">Chapter {chapter.number}</span>
                        <span className="text-lg">-</span>
                        <span>{chapter.title}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Released: {format(new Date(chapter.releaseDate), "PPP")}
                        {" • "} 
                        {chapter.pages.length} pages
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/chapters/${chapter.id}`}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteClick(chapter)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                Are you sure you want to delete Chapter {chapterToDelete?.number}: "{chapterToDelete?.title}"? This action cannot be undone.
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

export default ChapterList;
