
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useAdminManga, useAdminChapters } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Pencil, Trash, Eye, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ChapterList() {
  const navigate = useNavigate();
  const { allManga } = useAdminManga();
  const [selectedMangaId, setSelectedMangaId] = useState<string>('');
  const { chapters, deleteChapter } = useAdminChapters(selectedMangaId || undefined);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (allManga.data && allManga.data.length > 0 && !selectedMangaId) {
      setSelectedMangaId(allManga.data[0].id);
    }
  }, [allManga.data, selectedMangaId]);

  const handleDelete = (id: string) => {
    setChapterToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (chapterToDelete) {
      await deleteChapter.mutateAsync(chapterToDelete);
      setDeleteDialogOpen(false);
      setChapterToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <AdminLayout title="Manage Chapters">
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-64">
          <Select
            value={selectedMangaId}
            onValueChange={setSelectedMangaId}
            disabled={allManga.isLoading || !allManga.data || allManga.data.length === 0}
          >
            <SelectTrigger className="w-full">
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
        </div>
        <Button onClick={() => navigate('/admin/chapters/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Chapter
        </Button>
      </div>

      <div className="rounded-md border bg-card/50">
        {allManga.isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <p className="text-white/50">Loading manga...</p>
          </div>
        ) : !allManga.data || allManga.data.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center">
            <p className="text-white/50 mb-4">No manga available</p>
            <Button onClick={() => navigate('/admin/manga/new')}>Add Your First Manga</Button>
          </div>
        ) : chapters.isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <p className="text-white/50">Loading chapters...</p>
          </div>
        ) : !chapters.data || chapters.data.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center">
            <p className="text-white/50 mb-4">No chapters available for this manga</p>
            <Button onClick={() => navigate('/admin/chapters/new')}>Add First Chapter</Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chapter #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapters.data.map((chapter) => (
                <TableRow key={chapter.id}>
                  <TableCell className="font-medium">Chapter {chapter.number}</TableCell>
                  <TableCell>{chapter.title}</TableCell>
                  <TableCell>{formatDate(chapter.releaseDate)}</TableCell>
                  <TableCell>{chapter.pages.length} pages</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/manga/${chapter.mangaId}/chapter/${chapter.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/admin/chapters/${chapter.id}`)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(chapter.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chapter? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteChapter.isPending}>
              {deleteChapter.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
