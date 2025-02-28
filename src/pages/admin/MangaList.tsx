
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useAdminManga } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical, Pencil, Trash, Eye, Search, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function MangaList() {
  const navigate = useNavigate();
  const { allManga, deleteManga } = useAdminManga();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mangaToDelete, setMangaToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setMangaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (mangaToDelete) {
      await deleteManga.mutateAsync(mangaToDelete);
      setDeleteDialogOpen(false);
      setMangaToDelete(null);
    }
  };

  const filteredManga = allManga.data?.filter(manga => 
    manga.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <AdminLayout title="Manage Manga">
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search manga..."
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button onClick={() => navigate('/admin/manga/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Manga
        </Button>
      </div>

      <div className="rounded-md border bg-card/50">
        {allManga.isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <p className="text-white/50">Loading manga...</p>
          </div>
        ) : filteredManga.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Genres</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredManga.map((manga) => (
                <TableRow key={manga.id}>
                  <TableCell>
                    <div className="h-12 w-8 overflow-hidden rounded">
                      <img 
                        src={manga.coverImage} 
                        alt={manga.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{manga.title}</TableCell>
                  <TableCell>{manga.author}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        manga.status === 'ongoing' ? 'default' : 
                        manga.status === 'completed' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {manga.genres.slice(0, 2).map((genre) => (
                        <Badge key={genre} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                      {manga.genres.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{manga.genres.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/manga/${manga.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/admin/manga/${manga.id}`)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(manga.id)}
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
        ) : (
          <div className="h-60 flex flex-col items-center justify-center">
            <p className="text-white/50 mb-4">
              {searchQuery ? 'No manga found matching your search' : 'No manga available'}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/admin/manga/new')}>Add Your First Manga</Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this manga? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteManga.isPending}>
              {deleteManga.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
