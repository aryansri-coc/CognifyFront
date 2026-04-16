'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckCircle, Clock } from 'lucide-react';

interface Reminder {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  reason: string;
  taken: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setIsLoading(true);
    const response = await ApiClient.getMedicineReminders();
    if (response.success && Array.isArray(response.data)) {
      const fetchedReminders = response.data.map((r: any) => ({
        id: r.id || r._id || Date.now().toString(),
        name: r.name || 'Unknown',
        dosage: r.dosage || '',
        frequency: r.frequency || '',
        time: r.time || '',
        reason: r.reason || '',
        taken: r.status === 'taken' || r.taken || false,
      }));
      setReminders(fetchedReminders);
    } else {
      console.log('Failed to fetch reminders:', response.error);
    }
    setIsLoading(false);
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    reason: '',
  });

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.dosage && formData.frequency && formData.time) {
      const response = await ApiClient.addMedicineReminder({
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        time: formData.time,
        // reason is not currently supported by backend endpoint but added to form
      });
      
      if (response.success) {
        await fetchReminders();
        setFormData({ name: '', dosage: '', frequency: '', time: '', reason: '' });
        setShowAddForm(false);
      } else {
        console.log('Failed to add reminder:', response.error);
      }
    }
  };

  const toggleTaken = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;
    const newStatus = reminder.taken ? 'pending' : 'taken';
    
    // Optimistic update
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, taken: !r.taken } : r))
    );

    const response = await ApiClient.updateMedicineStatus(id, newStatus);
    if (!response.success) {
      // Revert if API fails
      setReminders(
        reminders.map((r) => (r.id === id ? { ...r, taken: r.taken } : r))
      );
      console.log('Failed to update status:', response.error);
    }
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const takenCount = reminders.filter((r) => r.taken).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medicine Reminders</h1>
          <p className="text-muted-foreground mt-2">Keep track of your medications</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Medicine
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="w-10 h-10 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold">{reminders.length}</div>
              <div className="text-sm text-muted-foreground">Total Medicines</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">{takenCount}</div>
              <div className="text-sm text-muted-foreground">Taken Today</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Medicine</CardTitle>
            <CardDescription>Record a new medicine reminder</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddReminder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Medicine Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Aspirin"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dosage *</label>
                  <Input
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g., 100mg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency *</label>
                  <Input
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    placeholder="e.g., Daily, Twice Daily"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time *</label>
                  <Input
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g., 08:00 AM"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Reason</label>
                  <Input
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="e.g., Heart Health"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Medicine</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : reminders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No medicine reminders found. Add one to get started!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
        {reminders.map((reminder) => (
          <Card
            key={reminder.id}
            className={`cursor-pointer transition-colors ${
              reminder.taken ? 'bg-muted' : ''
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTaken(reminder.id)}
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    reminder.taken
                      ? 'bg-green-500 border-green-500'
                      : 'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {reminder.taken && <CheckCircle className="w-4 h-4 text-white" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${reminder.taken ? 'line-through text-muted-foreground' : ''}`}>
                      {reminder.name}
                    </h3>
                    {reminder.reason && (
                      <Badge variant="outline" className="text-xs">
                        {reminder.reason}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {reminder.dosage} • {reminder.frequency}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {reminder.time}
                  </p>
                </div>

                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
