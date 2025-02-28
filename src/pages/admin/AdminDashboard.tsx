
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useAdminManga } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Plus, Trending } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { allManga } = useAdminManga();
  
  const totalManga = allManga.data?.length || 0;
  
  const dashboardCards = [
    {
      title: 'Total Manga',
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      value: totalManga,
      link: '/admin/manga',
    },
    {
      title: 'Active Series',
      icon: <Trending className="h-5 w-5 text-green-500" />,
      value: allManga.data?.filter(m => m.status === 'ongoing').length || 0,
      link: '/admin/manga',
    },
    {
      title: 'Completed Series',
      icon: <FileText className="h-5 w-5 text-orange-500" />,
      value: allManga.data?.filter(m => m.status === 'completed').length || 0,
      link: '/admin/manga',
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-6">
        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardCards.map((card) => (
            <Card key={card.title} className="bg-card/50 hover:bg-card/80 transition cursor-pointer" onClick={() => navigate(card.link)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  {card.icon} {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent actions */}
        <Card className="bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/admin/manga/new')}
            >
              <Plus size={24} />
              <span>Add New Manga</span>
            </Button>
            <Button
              className="h-24 flex flex-col items-center justify-center gap-2"
              variant="secondary"
              onClick={() => navigate('/admin/chapters/new')}
            >
              <Plus size={24} />
              <span>Add New Chapter</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent content */}
        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle>Latest Content</CardTitle>
          </CardHeader>
          <CardContent>
            {allManga.isLoading ? (
              <div className="h-40 flex items-center justify-center">
                <p className="text-white/50">Loading...</p>
              </div>
            ) : allManga.data && allManga.data.length > 0 ? (
              <div className="space-y-4">
                {allManga.data.slice(0, 5).map((manga) => (
                  <div
                    key={manga.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-card/80 transition cursor-pointer"
                    onClick={() => navigate(`/admin/manga/${manga.id}`)}
                  >
                    <div className="h-16 w-12 overflow-hidden rounded">
                      <img
                        src={manga.coverImage}
                        alt={manga.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{manga.title}</h3>
                      <p className="text-sm text-white/60">
                        {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)} • {manga.genres.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center">
                <p className="text-white/50 mb-4">No manga available</p>
                <Button onClick={() => navigate('/admin/manga/new')}>Add Your First Manga</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
