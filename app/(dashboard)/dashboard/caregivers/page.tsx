'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Mail, Shield, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    relationship: '',
    access: 'view-only' as const,
  });

  useEffect(() => {
    fetchCaregivers();
  }, []);

  const fetchCaregivers = async () => {
    setIsLoading(true);
    const response = await ApiClient.getCaregiverPatients();
    if (response.success && Array.isArray(response.data)) {
      const fetchedCaregivers = response.data.map((c: any) => ({
        id: c.id || c._id || Date.now().toString(),
        name: c.name || 'Unknown',
        email: c.email || '',
        relationship: c.relationship || 'Caregiver',
        access: c.access || 'view-only',
        joinedDate: c.joinedDate || c.createdAt || new Date().toISOString(),
      }));
      setCaregivers(fetchedCaregivers);
    }
    setIsLoading(false);
  };

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
      }
    }
  };

  const deleteCaregiver = (id: string) => {
    setCaregivers(caregivers.filter((c) => c.id !== id));
  };

  const getAccessBadgeColor = (access: string) => {
    switch (access) {
      case 'full':
        return 'bg-red-500 text-white';
      case 'limited':
        return 'bg-yellow-500 text-white';
      case 'view-only':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Guardians</h1>
          <p className="text-muted-foreground mt-2 font-medium">Coordinate with those who watch over your recovery.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2 rounded-none font-bold">
          <Plus className="w-4 h-4" />
          Add Caregiver
        </Button>
      </div>

      {showAddForm && (
        <Card className="rounded-xl border-2 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Onboard New Caregiver</CardTitle>
            <CardDescription className="font-medium">Define clear access levels to maintain your privacy and security.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleAddCaregiver} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Caregiver name"
                    className="rounded-none h-12 border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="rounded-none h-12 border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Relationship</label>
                  <Input
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="e.g., Daughter, Nurse"
                    className="rounded-none h-12 border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Access Level</label>
                  <select
                    value={formData.access}
                    onChange={(e) => setFormData({ ...formData, access: e.target.value as any })}
                    className="w-full h-12 px-3 border-2 border-input rounded-none bg-background text-sm font-bold uppercase tracking-widest focus-visible:outline-none focus-visible:border-primary transition-all"
                  >
                    <option value="view-only">View Only</option>
                    <option value="limited">Limited Access</option>
                    <option value="full">Full Access</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 justify-end pt-4 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)} className="font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-none px-8 font-black uppercase tracking-widest">
                  Invite Caregiver
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : caregivers.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground font-medium">
          No caregivers found. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-border rounded-xl overflow-hidden shadow-lg bg-background">
          {caregivers.map((caregiver, index) => (
            <div 
              key={caregiver.id} 
              className={cn(
                "group relative flex flex-col p-8 transition-all duration-300 hover:bg-muted/50",
                "border-b border-border",
                (index + 1) % 2 !== 0 && "md:border-r border-border",
                "last:border-b-0"
              )}
            >
              {/* Access Accent */}
              <div className={cn(
                "absolute top-0 left-0 w-full h-1.5 transition-colors",
                caregiver.access === 'full' ? "bg-red-500" : (caregiver.access === 'limited' ? "bg-yellow-500" : "bg-blue-500")
              )} />

              <div className="flex-1 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-foreground uppercase">{caregiver.name}</h3>
                    {caregiver.relationship && (
                       <Badge variant="outline" className="mt-2 rounded-none border-primary/30 text-[9px] font-black uppercase tracking-widest px-2">
                        {caregiver.relationship}
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={() => deleteCaregiver(caregiver.id)}
                    className="text-muted-foreground/30 hover:text-destructive hover:scale-125 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</p>
                      <p className="text-sm font-black text-foreground truncate max-w-[200px]">{caregiver.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-none bg-accent/10 flex items-center justify-center text-accent">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Joined</p>
                      <p className="text-sm font-black text-foreground">
                        {new Date(caregiver.joinedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-none flex items-center justify-center",
                      getAccessBadgeColor(caregiver.access)
                    )}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Permissions</p>
                      <p className="text-sm font-black uppercase tracking-tighter">
                        {caregiver.access.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
