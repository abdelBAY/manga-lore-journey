
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useAdminManga, useAdminChapters } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { AdminChapterFormData } from '@/lib/types';
import { ArrowLeft, Save, Plus, Trash } from 'lucide-react';

export default function ChapterForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allManga } = useAdminManga();
  const isEditing = id !== 'new';
  
  const [formData, setFormData] = useState<AdminChapterFormData>({
    mangaId: '',
    number: 1,
    title: '',
    releaseDate: new Date().toISOString(),
    pages: ['']
  });
  
  const { getChapterById, createChapter, updateChapter } = useAdminChapters(formData.mangaId);
  const chapterQuery = getChapterById(isEditing ? id! : '');
  
  const [errors, setErrors] = useState<Partial<Record<keyof AdminChapterFormData | 'pages', string>>>({});
  
  useEffect(() => {
    // If we're editing and have data, populate form
    if (isEditing && chapterQuery.data) {
      setFormData({
        mangaId: chapterQuery.data.mangaId,
        number: chapterQuery.data.number,
        title: chapterQuery.data.title,
        releaseDate: chapterQuery.data.releaseDate,
        pages: chapterQuery.data.pages.length > 0 ? chapterQuery.data.pages : ['']
      });
    }
    // If we're adding and have manga data, set the first manga as default
    else if (!isEditing && allManga.data && allManga.data.length > 0 && !formData.mangaId) {
      setFormData(prev => ({
        ...prev,
        mangaId: allManga.data[0].id
      }));
    }
  }, [isEditing, chapterQuery.data, allManga.data, formData.mangaId]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name as keyof AdminChapterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setFormData((prev) => ({ ...prev, number: value }));
      
      // Clear error for this field
      if (errors.number) {
        setErrors((prev) => ({ ...prev, number: undefined }));
      }
    }
  };
  
  const handleMangaChange = (mangaId: string) => {
    setFormData((prev) => ({ ...prev, mangaId }));
    
    // Clear error for this field
    if (errors.mangaId) {
      setErrors((prev) => ({ ...prev, mangaId: undefined }));
    }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Convert HTML date input format to ISO string
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setFormData((prev) => ({ ...prev, releaseDate: date.toISOString() }));
      
      // Clear error for this field
      if (errors.releaseDate) {
        setErrors((prev) => ({ ...prev, releaseDate: undefined }));
      }
    }
  };
  
  const handlePageChange = (index: number, value: string) => {
    const newPages = [...formData.pages];
    newPages[index] = value;
    setFormData((prev) => ({ ...prev, pages: newPages }));
    
    // Clear error for pages
    if (errors.pages) {
      setErrors((prev) => ({ ...prev, pages: undefined }));
    }
  };
  
  const addPage = () => {
    setFormData((prev) => ({
      ...prev,
      pages: [...prev.pages, '']
    }));
  };
  
  const removePage = (index: number) => {
    if (formData.pages.length > 1) {
      const newPages = [...formData.pages];
      newPages.splice(index, 1);
      setFormData((prev) => ({ ...prev, pages: newPages }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AdminChapterFormData | 'pages', string>> = {};
    
    if (!formData.mangaId) {
      newErrors.mangaId = 'Manga is required';
    }
    
    if (!formData.number || formData.number < 1) {
      newErrors.number = 'Valid chapter number is required';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.releaseDate) {
      newErrors.releaseDate = 'Release date is required';
    }
    
    // Check if all page URLs are valid
    const hasEmptyPages = formData.pages.some(page => !page.trim());
    if (hasEmptyPages) {
      newErrors.pages = 'All page URLs must be filled';
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
      await updateChapter.mutateAsync({ id: id!, data: formData });
    } else {
      await createChapter.mutateAsync(formData);
    }
    
    navigate('/admin/chapters');
  };
  
  // Format the release date for input
  const formatDateForInput = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  };
  
  return (
    <AdminLayout title={isEditing ? 'Edit Chapter' : 'Add New Chapter'}>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/chapters')}
          className="pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Chapter List
        </Button>
      </div>
      
      {(isEditing && chapterQuery.isLoading) || allManga.isLoading ? (
        <div className="h-60 flex items-center justify-center">
          <p className="text-white/50">Loading data...</p>
        </div>
      ) : !allManga.data || allManga.data.length === 0 ? (
        <div className="h-60 flex flex-col items-center justify-center">
          <p className="text-white/50 mb-4">You need to create a manga first</p>
          <Button onClick={() => navigate('/admin/manga/new')}>Add Your First Manga</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mangaId">Manga <span className="text-red-500">*</span></Label>
                      <Select
                        value={formData.mangaId}
                        onValueChange={handleMangaChange}
                        disabled={isEditing}
                      >
                        <SelectTrigger id="mangaId" className={errors.mangaId ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select a manga" />
                        </SelectTrigger>
                        <SelectContent>
                          {allManga.data?.map((manga) => (
                            <SelectItem key={manga.id} value={manga.id}>
                              {manga.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.mangaId && <p className="text-red-500 text-sm">{errors.mangaId}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="number">Chapter Number <span className="text-red-500">*</span></Label>
                      <Input
                        id="number"
                        name="number"
                        type="number"
                        min={1}
                        value={formData.number}
                        onChange={handleNumberChange}
                        className={errors.number ? "border-red-500" : ""}
                      />
                      {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Chapter Title <span className="text-red-500">*</span></Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Chapter title"
                        value={formData.title}
                        onChange={handleChange}
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="releaseDate">Release Date <span className="text-red-500">*</span></Label>
                      <Input
                        id="releaseDate"
                        name="releaseDate"
                        type="date"
                        value={formatDateForInput(formData.releaseDate)}
                        onChange={handleDateChange}
                        className={errors.releaseDate ? "border-red-500" : ""}
                      />
                      {errors.releaseDate && <p className="text-red-500 text-sm">{errors.releaseDate}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Chapter Pages <span className="text-red-500">*</span></Label>
                    <Button type="button" variant="outline" size="sm" onClick={addPage}>
                      <Plus className="mr-1 h-3 w-3" /> Add Page
                    </Button>
                  </div>
                  
                  {errors.pages && <p className="text-red-500 text-sm">{errors.pages}</p>}
                  
                  <div className="space-y-3">
                    {formData.pages.map((page, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-16">
                          <Label className="text-sm text-muted-foreground mb-1 block">Page {index + 1}</Label>
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="Image URL"
                            value={page}
                            onChange={(e) => handlePageChange(index, e.target.value)}
                            className={errors.pages ? "border-red-500" : ""}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePage(index)}
                          disabled={formData.pages.length <= 1}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/chapters')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createChapter.isPending || updateChapter.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {createChapter.isPending || updateChapter.isPending
                ? 'Saving...'
                : 'Save Chapter'}
            </Button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
