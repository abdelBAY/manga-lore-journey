
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const { user } = useAuth();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.rpc('set_user_admin', {
        email: newAdminEmail.trim()
      });
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'User has been granted admin privileges',
      });
      
      setNewAdminEmail('');
    } catch (error: any) {
      console.error('Error adding admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add admin',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Admin Settings">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 bg-card/50">
          <CardHeader>
            <CardTitle>Your Admin Account</CardTitle>
            <CardDescription>
              You are currently logged in as an administrator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Username</Label>
                  <div className="font-medium">{user?.username}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <div className="font-medium">{user?.email}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Grant admin access to other users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newAdminEmail">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="newAdminEmail"
                    placeholder="user@example.com"
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={isSubmitting || !newAdminEmail.trim()}>
                    {isSubmitting ? 'Adding...' : 'Add Admin'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  The user must already have an account in the system
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
