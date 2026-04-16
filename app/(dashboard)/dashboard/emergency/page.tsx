'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Phone, Mail, MapPin } from 'lucide-react';

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
    } else {
      console.log('Failed to fetch emergency contacts:', response.error);
    }
    setIsLoading(false);
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      const response = await ApiClient.addEmergencyContact({
        name: formData.name,
        phoneNumber: formData.phone,
        relationship: formData.relationship,
      });

      if (response.success) {
        await fetchContacts(); // Refresh list
        setFormData({ name: '', relationship: '', phone: '', email: '', address: '' });
        setShowAddForm(false);
      } else {
        console.log('Failed to add emergency contact:', response.error);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emergency Contacts</h1>
          <p className="text-muted-foreground mt-2">Quick access to important contacts</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Emergency Contact</CardTitle>
            <CardDescription>Add a new contact for emergencies</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contact name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Relationship</label>
                  <Input
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="e.g., Daughter, Doctor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Contact</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : contacts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No emergency contacts found. Add one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{contact.name}</CardTitle>
                  {contact.relationship && (
                    <Badge variant="outline" className="mt-2">
                      {contact.relationship}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <button
                  onClick={() => callContact(contact.phone)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{contact.phone}</span>
                </button>

                {contact.email && (
                  <button
                    onClick={() => emailContact(contact.email)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-sm">{contact.email}</span>
                  </button>
                )}

                {contact.address && (
                  <div className="flex items-start gap-2 p-2">
                    <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{contact.address}</span>
                  </div>
                )}
              </div>

              <Button onClick={() => callContact(contact.phone)} className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
