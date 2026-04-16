'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { User, Mail, Calendar, Ruler, Weight, UserCircle, Edit2, Check, X } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number | null;
  sex: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, healthRes] = await Promise.all([
        ApiClient.getProfile(),
        ApiClient.getLatestHealth()
      ]);

      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
        setFormData({
          name: profileRes.data.name || '',
          age: profileRes.data.age?.toString() || '',
          sex: profileRes.data.sex || '',
        });
      }

      if (healthRes.success && healthRes.data) {
        setLatestWeight(healthRes.data.weight || null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ApiClient.updateProfile({
        name: formData.name,
        age: parseInt(formData.age),
        sex: formData.sex,
      });

      if (response.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        fetchProfileData();
      } else {
        toast.error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred during update');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20">
            {profile?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute bottom-0 right-0 p-1.5 bg-background border rounded-full shadow-sm hover:bg-muted transition-colors"
            >
              <Edit2 className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{profile?.name || 'User Name'}</h1>
          <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
            <Mail className="h-4 w-4" />
            {profile?.email}
          </p>
          <p className="text-xs text-muted-foreground pt-1 italic">
            Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden border-2 transition-all hover:border-primary/20">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>View and manage your personal details</CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input 
                        id="age" 
                        type="number"
                        min="1"
                        max="120"
                        value={formData.age} 
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="e.g. 65"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sex">Biological Sex</Label>
                      <Select 
                        value={formData.sex} 
                        onValueChange={(value) => setFormData({ ...formData, sex: value })}
                      >
                        <SelectTrigger id="sex">
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="gap-2">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button type="submit" className="gap-2">
                      <Check className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary">
                      <UserCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="text-foreground">{profile?.name || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Age</p>
                      <p className="text-foreground">{profile?.age ? `${profile.age} years` : 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Biological Sex</p>
                      <p className="text-foreground">{profile?.sex || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-2 transition-all hover:border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Physical Metrics</CardTitle>
              <CardDescription>Latest values from health logs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-accent/50 border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                    <Weight className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-sm">Weight</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">{latestWeight ? `${latestWeight} kg` : '--'}</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground italic text-center">
                Metrics are automatically updated from your latest health entries.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm">Health Tip</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Keeping your profile updated helps our AI provide more accurate cognitive and health insights tailored specifically to you.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
