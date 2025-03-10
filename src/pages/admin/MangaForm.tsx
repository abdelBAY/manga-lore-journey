import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchMangaById, createManga, updateManga } from "@/lib/admin-api";
import { AdminMangaFormData, Genre } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { checkIsAdmin } from "@/lib/supabase";

const GENRES: Genre[] = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller'
];

const STATUS_OPTIONS = [
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'hiatus', label: 'Hiatus' }
];

const defaultFormData: AdminMangaFormData = {
  title: "",
  coverImage: "",
  description: "",
  status: "ongoing",
  genres: [],
  author: "",
  artist: "",
  releaseYear: new Date().getFullYear(),
  rating: 0
};

const MangaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<AdminMangaFormData>(defaultFormData);
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const isEditMode = !!id;

  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await checkIsAdmin();
      setIsAdmin(admin);
      if (!admin) {
        navigate("/");
      } else if (isEditMode) {
        loadManga();
      }
    };

    const loadManga = async () => {
      if (!id) return;
      
      try {
        const manga = await fetchMangaById(id);
        if (manga) {
          setFormData({
            title: manga.title,
            coverImage: manga.coverImage,
            description: manga.description,
            status: manga.status,
            genres: manga.genres as Genre[],
            author: manga.author,
            artist: manga.artist,
            releaseYear: manga.releaseYear,
            rating: manga.rating
          });
        } else {
          toast({
            title: "Error",
            description: "Manga not found.",
            variant: "destructive",
          });
          navigate("/admin/manga");
        }
      } catch (error) {
        console.error("Error loading manga:", error);
        toast({
          title: "Error",
          description: "Failed to load manga data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [id, navigate, toast, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleGenreToggle = (genre: Genre) => {
    setFormData(prev => {
      const genres = [...prev.genres];
      if (genres.includes(genre)) {
        return { ...prev, genres: genres.filter(g => g !== genre) };
      } else {
        return { ...prev, genres: [...genres, genre] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditMode && id) {
        await updateManga(id, formData);
        toast({
          title: "Success",
          description: "Manga updated successfully.",
        });
      } else {
        const result = await createManga(formData);
        if (result) {
          toast({
            title: "Success",
            description: "Manga created successfully.",
          });
          navigate(`/admin/manga/${result.id}`);
        }
      }
    } catch (error) {
      console.error("Error saving manga:", error);
      toast({
        title: "Error",
        description: "Failed to save manga. Please try again.",
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
    <AdminLayout title={id ? "Edit Manga" : "Create Manga"}>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">
          {isEditMode ? "Edit Manga" : "Add New Manga"}
        </h1>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Manga Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="artist">Artist</Label>
                  <Input
                    id="artist"
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="releaseYear">Release Year</Label>
                  <Input
                    id="releaseYear"
                    name="releaseYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.releaseYear}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Genres</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {GENRES.map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={formData.genres.includes(genre)}
                        onCheckedChange={() => handleGenreToggle(genre)}
                      />
                      <label
                        htmlFor={`genre-${genre}`}
                        className="text-sm cursor-pointer"
                      >
                        {genre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/manga")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : isEditMode ? "Update Manga" : "Create Manga"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
};

export default MangaForm;
