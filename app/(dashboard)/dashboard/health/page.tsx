'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HealthChart } from '@/components/health-chart';
import { Plus } from 'lucide-react';

interface HealthData {
  date: string;
  heartRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  glucose: number;
  weight: number;
  steps: number;
  sleepHours: number;
}

export default function HealthPage() {
  const [data, setData] = useState<HealthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    setIsLoading(true);
    const response = await ApiClient.getHealthData();
    if (response.success && Array.isArray(response.data)) {
      const fetchedData = response.data.map((d: any) => ({
        date: d.date || (d.timestamp ? new Date(d.timestamp).toLocaleDateString('en-US', { weekday: 'short' }) : new Date().toLocaleDateString('en-US', { weekday: 'short' })),
        heartRate: d.heartRate ?? d.heartRateAvg ?? 0,
        bloodPressureSys: d.bloodPressureSys || 0,
        bloodPressureDia: d.bloodPressureDia || 0,
        glucose: d.glucose || 0,
        weight: d.weight || 0,
        steps: d.stepsCount ?? d.steps ?? 0,
        sleepHours: d.sleepHours ?? d.totalSleepHours ?? 0,
      }));
      setData(fetchedData);
    } else {
      console.log('Failed to fetch health data:', response.error);
    }
    setIsLoading(false);
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    heartRate: '',
    bloodPressureSys: '',
    bloodPressureDia: '',
    glucose: '',
    weight: '',
    steps: '',
    sleepHours: '',
  });

  const handleAddData = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    
    // Sync to backend first
    const payload = {
      date: today,
      heartRate: parseInt(formData.heartRate) || 0,
      bloodPressureSys: parseInt(formData.bloodPressureSys) || 0,
      bloodPressureDia: parseInt(formData.bloodPressureDia) || 0,
      glucose: parseInt(formData.glucose) || 0,
      weight: parseFloat(formData.weight) || 0,
      stepsCount: parseInt(formData.steps) || 0,
      steps: parseInt(formData.steps) || 0,
      sleepHours: parseFloat(formData.sleepHours) || 0,
    };

    const response = await ApiClient.syncHealth(payload);
    
    if (response.success) {
      toast.success('Health data saved successfully');
      await fetchHealthData();
      setFormData({
        heartRate: '',
        bloodPressureSys: '',
        bloodPressureDia: '',
        glucose: '',
        weight: '',
        steps: '',
        sleepHours: '',
      });
      setShowAddForm(false);
    } else {
      toast.error(response.error || 'Failed to add health data');
      console.log('Failed to add health data:', response.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Tracking</h1>
          <p className="text-muted-foreground mt-2">Monitor your vital signs and wellness metrics</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Data
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Log Health Data</CardTitle>
            <CardDescription>Record your vital signs and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddData} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Heart Rate (bpm)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 72"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Systolic BP (mmHg)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 120"
                    value={formData.bloodPressureSys}
                    onChange={(e) => setFormData({ ...formData, bloodPressureSys: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Diastolic BP (mmHg)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 80"
                    value={formData.bloodPressureDia}
                    onChange={(e) => setFormData({ ...formData, bloodPressureDia: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Blood Glucose (mg/dL)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 95"
                    value={formData.glucose}
                    onChange={(e) => setFormData({ ...formData, glucose: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="e.g. 70.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Steps</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 8000"
                    value={formData.steps}
                    onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sleep (hours)</label>
                  <Input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    placeholder="e.g. 7.5"
                    value={formData.sleepHours}
                    onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Data</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : data.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No health data logged yet. Add some to get started!
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthChart data={data} metric="heartRate" title="Heart Rate" unit="bpm" />
        <HealthChart data={data} metric="weight" title="Weight" unit="kg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthChart data={data} metric="steps" title="Daily Steps" unit="steps" />
        <HealthChart data={data} metric="sleepHours" title="Sleep Duration" unit="hours" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blood Pressure & Glucose</CardTitle>
          <CardDescription>Systolic/Diastolic pressure and glucose levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-medium">Blood Pressure (Systolic)</h3>
              <HealthChart data={data} metric="bloodPressureSys" title="Systolic BP" unit="mmHg" hideTitle />
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Blood Glucose</h3>
              <HealthChart data={data} metric="glucose" title="Glucose" unit="mg/dL" hideTitle />
            </div>
          </div>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
}
