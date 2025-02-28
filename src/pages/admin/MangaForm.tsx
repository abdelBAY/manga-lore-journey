
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useAdminManga } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminMangaFormData, Genre } from '@/lib/types';
import { ArrowLeft, Save } from 'lucide-react';

const allGenres: Genre[] = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Horror', 'Mystery', 'Romance', 'Sci-Fi',
  'Slice of Life', 'Sports', 'Supernatural', 'Thriller'
];

export default function MangaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMangaById, createManga, updateManga } = useAdminManga();
  
  const isEditing = id !== 'new';
  const mangaQuery = getMangaById(isEditing ? id! : '');
  
  const [formData, setFormData] = useState<AdminMangaFormData>({
    title: '',
    coverImage: '',
    description: '',
    status: 'ongoing',
    genres: [],
    author: '',
    artist: '',
    releaseYear: new Date().getFullYear(),
    rating: 0
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof AdminMangaFormData, string>>>({});
  
  useEffect(() => {
    if (isEditing && mangaQuery.data) {
      setFormData({
        title: mangaQuery.data.title,
        coverImage: mangaQuery.data.coverImage,
        description: mangaQuery.data.description,
        status: mangaQuery.data.status,
        genres: mangaQuery.data.genres as Genre[],
        author: mangaQuery.data.author,
        artist: mangaQuery.data.artist,
        releaseYear: mangaQuery.data.releaseYear,
        rating: mangaQuery.data.rating
      });
    }
  }, [isEditing, mangaQuery.data]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name as keyof AdminMangaFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof AdminMangaFormData
  ) => {
    const value = parseFloat(e.target.value);
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };
  
  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      status: value as 'ongoing' | 'completed' | 'hiatus' 
    }));
  };
  
  const handleGenreToggle = (genre: Genre) => {
    setFormData((prev) => {
      const newGenres = prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre];
      
      return { ...prev, genres: newGenres };
    });
    
    // Clear error for genres
    if (errors.genres) {
      setErrors((prev) => ({ ...prev, genres: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AdminMangaFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.coverImage.trim()) {
      newErrors.coverImage = 'Cover image URL is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.genres.length === 0) {
      newErrors.genres = 'At least one genre is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist is required';
    }
    
    if (isNaN(formData.releaseYear) || formData.releaseYear < 1900 || formData.releaseYear > new Date().getFullYear()) {
      newErrors.releaseYear = 'Valid release year is required';
    }
    
    if (isNaN(formData.rating) || formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditing) {
      await updateManga.mutateAsync({ id: id!, data: formData });
    } else {
      await createManga.mutateAsync(formData);
    }
    
    navigate('/admin/manga');
  };
  
  return (
    <AdminLayout title={isEditing ? 'Edit Manga' : 'Add New Manga'}>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/manga')}
          className="pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Manga List
        </Button>
      </div>
      
      {isEditing && mangaQuery.isLoading ? (
        <div className="h-60 flex items-center justify-center">
          <p className="text-white/50">Loading manga data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main info */}
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Manga title"
                    value={formData.title}
                    onChange={handleChange}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter a description of the manga"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author <span className="text-red-500">*</span></Label>
                    <Input
                      id="author"
                      name="author"
                      placeholder="Author name"
                      value={formData.author}
                      onChange={handleChange}
                      className={errors.author ? "border-red-500" : ""}
                    />
                    {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="artist">Artist <span className="text-red-500">*</span></Label>
                    <Input
                      id="artist"
                      name="artist"
                      placeholder="Artist name"
                      value={formData.artist}
                      onChange={handleChange}
                      className={errors.artist ? "border-red-500" : ""}
                    />
                    {errors.artist && <p className="text-red-500 text-sm">{errors.artist}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="hiatus">Hiatus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="releaseYear">Release Year <span className="text-red-500">*</span></Label>
                    <Input
                      id="releaseYear"
                      name="releaseYear"
                      type="number"
                      min={1900}
                      max={new Date().getFullYear()}
                      value={formData.releaseYear}
                      onChange={(e) => handleNumberChange(e, 'releaseYear')}
                      className={errors.releaseYear ? "border-red-500" : ""}
                    />
                    {errors.releaseYear && <p className="text-red-500 text-sm">{errors.releaseYear}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5) <span className="text-red-500">*</span></Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={formData.rating}
                      onChange={(e) => handleNumberChange(e, 'rating')}
                      className={errors.rating ? "border-red-500" : ""}
                    />
                    {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="coverImage">Cover Image URL <span className="text-red-500">*</span></Label>
                      <Input
                        id="coverImage"
                        name="coverImage"
                        placeholder="https://example.com/image.jpg"
                        value={formData.coverImage}
                        onChange={handleChange}
                        className={errors.coverImage ? "border-red-500" : ""}
                      />
                      {errors.coverImage && <p className="text-red-500 text-sm">{errors.coverImage}</p>}
                    </div>
                    
                    {formData.coverImage && (
                      <div className="aspect-[2/3] overflow-hidden rounded-md border border-border">
                        <img
                          src={formData.coverImage}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Invalid+Image';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Genres <span className="text-red-500">*</span></Label>
                      {errors.genres && <p className="text-red-500 text-sm">{errors.genres}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {allGenres.map((genre) => (
                        <div key={genre} className="flex items-center space-x-2">
                          <Checkbox
                            id={`genre-${genre}`}
                            checked={formData.genres.includes(genre)}
                            onCheckedChange={() => handleGenreToggle(genre)}
                          />
                          <Label
                            htmlFor={`genre-${genre}`}
                            className="text-sm cursor-pointer"
                          >
                            {genre}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/manga')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createManga.isPending || updateManga.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {createManga.isPending || updateManga.isPending
                ? 'Saving...'
                : 'Save Manga'}
            </Button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
