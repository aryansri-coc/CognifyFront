'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
}

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    const response = await ApiClient.getEmergencyContacts();
    if (response.success && Array.isArray(response.data)) {
      const fetchedContacts = response.data.map((c: any) => ({
        id: c.id || c._id || Date.now().toString(),
        name: c.name || 'Unknown',
        relationship: c.relationship || '',
        phone: c.phone || c.phoneNumber || '',
        email: c.email || '',
        address: c.address || '',
      }));
      setContacts(fetchedContacts);
    }
    setIsLoading(false);
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      const response = await ApiClient.addEmergencyContact({
        name: formData.name,
        phoneNumber: formData.phone,
        relationship: formData.relationship,
      });

      if (response.success) {
        await fetchContacts(); 
        setFormData({ name: '', relationship: '', phone: '', email: '', address: '' });
        setShowAddForm(false);
      }
    }
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const callContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const emailContact = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Lifeline</h1>
          <p className="text-muted-foreground mt-2 font-medium">Instant access to your critical support network.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2 rounded-none font-bold">
          <Plus className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      {showAddForm && (
        <Card className="rounded-xl border-2 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Register Emergency Contact</CardTitle>
            <CardDescription className="font-medium">All details are kept secure and shared only with verified caregivers.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleAddContact} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contact name"
                    className="rounded-none h-12 border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Relationship</label>
                  <Input
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="e.g., Daughter, Doctor"
                    className="rounded-none h-12 border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
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
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Primary Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                    className="rounded-none h-12 border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-4 justify-end pt-4 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)} className="font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-none px-8 font-black uppercase tracking-widest">
                  Save Contact
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
      ) : contacts.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground font-medium">
          No emergency contacts found. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-border rounded-xl overflow-hidden shadow-lg bg-background">
        {contacts.map((contact, index) => (
          <div 
            key={contact.id} 
            className={cn(
               "group relative flex flex-col p-8 transition-all duration-300 hover:bg-muted/50",
               "border-b border-border",
               (index + 1) % 3 !== 0 && "lg:border-r border-border",
               (index + 1) % 2 !== 0 && "md:border-r border-border",
               "last:border-b-0"
            )}
          >
            {/* Call Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
               <Phone className="w-12 h-12 text-primary -rotate-12" />
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-black tracking-tight text-foreground uppercase">{contact.name}</h3>
                  {contact.relationship && (
                    <Badge variant="outline" className="mt-2 rounded-none border-primary/30 text-[9px] font-black uppercase tracking-widest px-2">
                       {contact.relationship}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="text-muted-foreground/30 hover:text-destructive hover:scale-125 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => callContact(contact.phone)}
                  className="w-full flex items-center gap-4 group/item"
                >
                  <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone</p>
                    <p className="text-sm font-black text-foreground">{contact.phone}</p>
                  </div>
                </button>

                {contact.email && (
                  <button
                    onClick={() => emailContact(contact.email)}
                    className="w-full flex items-center gap-4 group/item"
                  >
                    <div className="w-10 h-10 rounded-none bg-accent/10 flex items-center justify-center text-accent group-hover/item:bg-accent group-hover/item:text-white transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</p>
                      <p className="text-sm font-black text-foreground truncate max-w-[150px]">{contact.email}</p>
                    </div>
                  </button>
                )}

                {contact.address && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-none bg-secondary/10 flex items-center justify-center text-secondary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Location</p>
                      <p className="text-sm font-medium text-muted-foreground line-clamp-1">{contact.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <Button onClick={() => callContact(contact.phone)} className="w-full rounded-none font-black uppercase tracking-widest h-12 group-hover:bg-primary/90 transition-colors">
                <Phone className="w-4 h-4 mr-2" />
                Initiate Call
              </Button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
