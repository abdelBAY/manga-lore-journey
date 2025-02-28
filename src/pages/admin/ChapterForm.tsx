
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchChapterById, createChapter, updateChapter, fetchAllManga } from "@/lib/admin-api";
import { AdminChapterFormData, Manga } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { XCircle, Plus } from "lucide-react";
import { checkIsAdmin } from "@/lib/supabase";

const defaultFormData: AdminChapterFormData = {
  mangaId: "",
  number: 1,
  title: "",
  releaseDate: new Date().toISOString().split('T')[0],
  pages: [""]
};

const ChapterForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<AdminChapterFormData>(defaultFormData);
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const queryMangaId = searchParams.get('mangaId');
  
  const isEditMode = !!id;

  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await checkIsAdmin();
      setIsAdmin(admin);
      if (!admin) {
        navigate("/");
      } else {
        await loadManga();
        if (isEditMode) {
          await loadChapter();
        } else if (queryMangaId) {
          setFormData(prev => ({ ...prev, mangaId: queryMangaId }));
        }
      }
    };

    const loadManga = async () => {
      try {
        const data = await fetchAllManga();
        setManga(data);
        return data;
      } catch (error) {
        console.error("Error loading manga:", error);
        toast({
          title: "Error",
          description: "Failed to load manga list.",
          variant: "destructive",
        });
      }
    };

    const loadChapter = async () => {
      if (!id) return;
      
      try {
        const chapter = await fetchChapterById(id);
        if (chapter) {
          setFormData({
            mangaId: chapter.mangaId,
            number: chapter.number,
            title: chapter.title,
            releaseDate: new Date(chapter.releaseDate).toISOString().split('T')[0],
            pages: chapter.pages
          });
        } else {
          toast({
            title: "Error",
            description: "Chapter not found.",
            variant: "destructive",
          });
          navigate("/admin/chapters");
        }
      } catch (error) {
        console.error("Error loading chapter:", error);
        toast({
          title: "Error",
          description: "Failed to load chapter data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [id, navigate, toast, isEditMode, queryMangaId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (index: number, value: string) => {
    setFormData(prev => {
      const pages = [...prev.pages];
      pages[index] = value;
      return { ...prev, pages };
    });
  };

  const addPage = () => {
    setFormData(prev => ({ ...prev, pages: [...prev.pages, ""] }));
  };

  const removePage = (index: number) => {
    setFormData(prev => {
      const pages = [...prev.pages];
      pages.splice(index, 1);
      
      // Always have at least one page
      if (pages.length === 0) {
        pages.push("");
      }
      
      return { ...prev, pages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty page URLs
    const validPages = formData.pages.filter(page => page.trim() !== "");
    
    if (validPages.length === 0) {
      toast({
        title: "Validation Error",
        description: "You need to add at least one page URL.",
        variant: "destructive",
      });
      return;
    }
    
    const dataToSubmit = {
      ...formData,
      pages: validPages
    };
    
    setSaving(true);

    try {
      if (isEditMode && id) {
        await updateChapter(id, dataToSubmit);
        toast({
          title: "Success",
          description: "Chapter updated successfully.",
        });
      } else {
        const result = await createChapter(dataToSubmit);
        if (result) {
          toast({
            title: "Success",
            description: "Chapter created successfully.",
          });
          navigate(`/admin/chapters?mangaId=${result.mangaId}`);
        }
      }
    } catch (error) {
      console.error("Error saving chapter:", error);
      toast({
        title: "Error",
        description: "Failed to save chapter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isAdmin === null || loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">
          {isEditMode ? "Edit Chapter" : "Add New Chapter"}
        </h1>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Chapter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mangaId">Manga</Label>
                <Select
                  value={formData.mangaId}
                  onValueChange={(value) => handleSelectChange("mangaId", value)}
                  disabled={isEditMode}
                  required
                >
                  <SelectTrigger id="mangaId">
                    <SelectValue placeholder="Select a manga" />
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="number">Chapter Number</Label>
                  <Input
                    id="number"
                    name="number"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.number}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="releaseDate">Release Date</Label>
                  <Input
                    id="releaseDate"
                    name="releaseDate"
                    type="date"
                    value={formData.releaseDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Chapter Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Pages (URLs)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPage}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Page
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.pages.map((page, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <span className="bg-muted px-2 py-1 text-sm rounded-l-md border border-r-0 border-input">
                            {index + 1}
                          </span>
                          <Input
                            value={page}
                            onChange={(e) => handlePageChange(index, e.target.value)}
                            placeholder="https://example.com/page.jpg"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePage(index)}
                        disabled={formData.pages.length <= 1}
                      >
                        <XCircle className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/admin/chapters${formData.mangaId ? `?mangaId=${formData.mangaId}` : ''}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : isEditMode ? "Update Chapter" : "Create Chapter"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ChapterForm;
