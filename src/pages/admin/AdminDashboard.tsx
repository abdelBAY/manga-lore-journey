
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, Book, PlusCircle, BookOpen, Users, Settings
} from "lucide-react";

const AdminDashboard = () => {
  // Admin check removed for development purposes
  
  return (
    <AdminLayout title="Admin Dashboard">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Total Manga</CardTitle>
              <Book className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-sm text-muted-foreground">Titles in database</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Total Chapters</CardTitle>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-sm text-muted-foreground">Chapters published</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Daily Views</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-sm text-muted-foreground">Page views today</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Manga Management</CardTitle>
              <CardDescription>Add, edit, or remove manga from your library</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/admin/manga/new"><PlusCircle className="mr-2 h-4 w-4" /> Add New Manga</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/manga"><Book className="mr-2 h-4 w-4" /> View All Manga</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Chapter Management</CardTitle>
              <CardDescription>Add, edit, or remove chapters for your manga</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/admin/chapters/new"><PlusCircle className="mr-2 h-4 w-4" /> Add New Chapter</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/chapters"><BookOpen className="mr-2 h-4 w-4" /> View All Chapters</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
