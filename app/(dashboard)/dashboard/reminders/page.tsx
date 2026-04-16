'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    reason: '',
  });

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
    }
    setIsLoading(false);
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.dosage && formData.frequency && formData.time) {
      const response = await ApiClient.addMedicineReminder({
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        time: formData.time,
      });
      
      if (response.success) {
        await fetchReminders();
        setFormData({ name: '', dosage: '', frequency: '', time: '', reason: '' });
        setShowAddForm(false);
      }
    }
  };

  const toggleTaken = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;
    const newStatus = reminder.taken ? 'pending' : 'taken';
    
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, taken: !r.taken } : r))
    );

    const response = await ApiClient.updateMedicineStatus(id, newStatus);
    if (!response.success) {
      setReminders(
        reminders.map((r) => (r.id === id ? { ...r, taken: r.taken } : r))
      );
    }
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const takenCount = reminders.filter((r) => r.taken).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Apothecary</h1>
          <p className="text-muted-foreground mt-2 font-medium">Precision medication tracking and reminders.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2 rounded-none font-bold">
          <Plus className="w-4 h-4" />
          Add Medicine
        </Button>
      </div>

      {/* Summary Metrics Cubes */}
      <div className="grid grid-cols-2 gap-0 border-2 border-border rounded-xl overflow-hidden shadow-sm bg-background">
        <div className="flex flex-col items-center justify-center p-8 border-r border-border hover:bg-muted/30 transition-colors">
          <Clock className="w-10 h-10 text-primary mb-3" />
          <div className="text-4xl font-black tracking-tighter text-foreground">{reminders.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Total Medicines</div>
        </div>
        <div className="flex flex-col items-center justify-center p-8 hover:bg-muted/30 transition-colors">
          <CheckCircle className="w-10 h-10 text-green-500 mb-3" />
          <div className="text-4xl font-black tracking-tighter text-foreground">{takenCount}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Taken Today</div>
        </div>
      </div>

      {showAddForm && (
        <Card className="rounded-xl border-2 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Register New Medicine</CardTitle>
            <CardDescription className="font-medium">Enter exact dosage and frequency requirements.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleAddReminder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Medicine Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Aspirin"
                    className="rounded-none h-12 border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Dosage</label>
                  <Input
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g., 100mg"
                    className="rounded-none h-12 border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Frequency</label>
                  <Input
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    placeholder="e.g., Daily, Twice Daily"
                    className="rounded-none h-12 border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Time</label>
                  <Input
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g., 08:00 AM"
                    className="rounded-none h-12 border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Reason</label>
                  <Input
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="e.g., Heart Health"
                    className="rounded-none h-12 border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-4 justify-end pt-4 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)} className="font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-none px-8 font-black uppercase tracking-widest">
                  Save Reminder
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
      ) : reminders.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground font-medium">
          No medicine reminders found. Add one to get started!
        </div>
      ) : (
        <div className="border-2 border-border rounded-xl overflow-hidden shadow-md bg-background divide-y-2 divide-border">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={cn(
              "group relative flex items-center gap-6 p-6 transition-all duration-300",
              reminder.taken ? 'bg-muted/50' : 'hover:bg-muted/30'
            )}
          >
            {/* Status Indicator Bar */}
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1.5 transition-colors",
              reminder.taken ? "bg-green-500" : "bg-primary/20 group-hover:bg-primary"
            )} />

            <button
              onClick={() => toggleTaken(reminder.id)}
              className={cn(
                "relative flex-shrink-0 w-8 h-8 rounded-none border-2 flex items-center justify-center transition-all duration-300",
                reminder.taken
                  ? 'bg-green-500 border-green-500 rotate-0'
                  : 'border-muted-foreground/40 group-hover:border-primary group-hover:rotate-90'
              )}
            >
              {reminder.taken ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : (
                <div className="w-2 h-2 bg-primary/20 group-hover:bg-primary rounded-full" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h3 className={cn(
                  "text-lg font-black tracking-tight truncate",
                  reminder.taken ? 'line-through text-muted-foreground opacity-60' : 'text-foreground'
                )}>
                  {reminder.name}
                </h3>
                {reminder.reason && (
                  <Badge variant="outline" className="rounded-none border-primary/30 text-[9px] font-black uppercase tracking-widest py-0 px-2 h-5">
                    {reminder.reason}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-muted-foreground/20" />
                  {reminder.dosage}
                </p>
                <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-muted-foreground/20" />
                  {reminder.frequency}
                </p>
                <p className="text-xs font-black text-primary uppercase flex items-center gap-1.5 ml-auto md:ml-0">
                  <Clock className="w-3.5 h-3.5" />
                  {reminder.time}
                </p>
              </div>
            </div>

            <button
              onClick={() => deleteReminder(reminder.id)}
              className="text-muted-foreground/40 hover:text-destructive hover:scale-125 transition-all p-2"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
