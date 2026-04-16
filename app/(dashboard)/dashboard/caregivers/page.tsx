'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Mail, Shield, Clock } from 'lucide-react';

interface Caregiver {
  id: string;
  name: string;
  email: string;
  relationship: string;
  access: 'full' | 'limited' | 'view-only';
  joinedDate: string;
}

export default function CaregiversPage() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCaregivers();
  }, []);

  const fetchCaregivers = async () => {
    setIsLoading(true);
    const response = await ApiClient.getCaregiverPatients();
    if (response.success && Array.isArray(response.data)) {
      // Map API response to match interface in case of field differences
      const fetchedCaregivers = response.data.map((c: any) => ({
        id: c.id || c._id || Date.now().toString(),
        name: c.name || 'Unknown',
        email: c.email || '',
        relationship: c.relationship || 'Caregiver',
        access: c.access || 'view-only',
        joinedDate: c.joinedDate || c.createdAt || new Date().toISOString(),
      }));
      setCaregivers(fetchedCaregivers);
    } else {
      console.log('Failed to fetch caregivers:', response.error);
    }
    setIsLoading(false);
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    relationship: '',
    access: 'view-only' as const,
  });

  const handleAddCaregiver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      const response = await ApiClient.addCaregiver({
        name: formData.name,
        email: formData.email,
        specialty: formData.relationship,
      });

      if (response.success) {
        await fetchCaregivers(); // Refresh list
        setFormData({ name: '', email: '', relationship: '', access: 'view-only' });
        setShowAddForm(false);
      } else {
        console.log('Failed to add caregiver:', response.error);
      }
    }
  };

  const deleteCaregiver = (id: string) => {
    setCaregivers(caregivers.filter((c) => c.id !== id));
  };

  const getAccessBadgeColor = (access: string) => {
    switch (access) {
      case 'full':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'view-only':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Caregivers</h1>
          <p className="text-muted-foreground mt-2">Manage caregivers who can access your health information</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Caregiver
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Caregiver</CardTitle>
            <CardDescription>Invite someone to help manage your health</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCaregiver} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Caregiver name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Relationship</label>
                  <Input
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="e.g., Daughter, Nurse"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Access Level</label>
                  <select
                    value={formData.access}
                    onChange={(e) => setFormData({ ...formData, access: e.target.value as any })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="view-only">View Only</option>
                    <option value="limited">Limited Access</option>
                    <option value="full">Full Access</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Caregiver</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : caregivers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No caregivers found. Add one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caregivers.map((caregiver) => (
            <Card key={caregiver.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{caregiver.name}</CardTitle>
                    {caregiver.relationship && (
                      <CardDescription className="mt-1">{caregiver.relationship}</CardDescription>
                    )}
                  </div>
                  <button
                    onClick={() => deleteCaregiver(caregiver.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{caregiver.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Joined {new Date(caregiver.joinedDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <Badge className={getAccessBadgeColor(caregiver.access)}>
                    {caregiver.access === 'full' && 'Full Access'}
                    {caregiver.access === 'limited' && 'Limited Access'}
                    {caregiver.access === 'view-only' && 'View Only'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
