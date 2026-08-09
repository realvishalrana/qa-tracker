'use client';

import { useEffect, useState } from 'react';
import type { Bug, Feature } from '@/types';
import { bugsApi } from '@/features/bugs/services/bugsApi';
import { featuresApi } from '@/features/projects/services/projectsApi';
import { Button } from '@/components/ui/Button';
import { Label, Select, Textarea } from '@/components/ui/Form';
import { useToast } from '@/components/ui/Toast';
import { withMutationToast } from '@/lib/mutationToast';
import { updateBugDetailsSchema, formatZodError } from '@/lib/validation';

type BugEditFormProps = {
  bug: Bug;
  onSaved: () => Promise<void>;
};

export function BugEditForm({ bug, onSaved }: BugEditFormProps) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [description, setDescription] = useState(bug.description || '');
  const [featureId, setFeatureId] = useState(bug.featureId || '');
  const [expectedResult, setExpectedResult] = useState(bug.expectedResult || '');
  const [actualResult, setActualResult] = useState(bug.actualResult || '');
  const [reproductionSteps, setReproductionSteps] = useState(bug.reproductionSteps || '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDescription(bug.description || '');
    setFeatureId(bug.featureId || '');
    setExpectedResult(bug.expectedResult || '');
    setActualResult(bug.actualResult || '');
    setReproductionSteps(bug.reproductionSteps || '');
  }, [bug]);

  useEffect(() => {
    if (!editing || !bug.projectId) return;
    void featuresApi.list(bug.projectId).then((res) => setFeatures(res.data as Feature[]));
  }, [editing, bug.projectId]);

  function cancel() {
    setDescription(bug.description || '');
    setFeatureId(bug.featureId || '');
    setExpectedResult(bug.expectedResult || '');
    setActualResult(bug.actualResult || '');
    setReproductionSteps(bug.reproductionSteps || '');
    setError(null);
    setEditing(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const parsed = updateBugDetailsSchema.safeParse({
      description,
      featureId: featureId || null,
      expectedResult,
      actualResult,
      reproductionSteps,
    });
    if (!parsed.success) {
      setError(formatZodError(parsed.error));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await withMutationToast(
        toast,
        async () => {
          await bugsApi.update(bug.id, {
            description: parsed.data.description || undefined,
            featureId: parsed.data.featureId ?? null,
            expectedResult: parsed.data.expectedResult || undefined,
            actualResult: parsed.data.actualResult || undefined,
            reproductionSteps: parsed.data.reproductionSteps || undefined,
          });
          await onSaved();
        },
        { success: 'Bug details updated' }
      );
      setEditing(false);
    } catch {
      // toast shown by withMutationToast
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex justify-end">
        <Button type="button" variant="secondary" onClick={() => setEditing(true)}>
          Edit details
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={save} className="space-y-3 rounded-xl border border-teal-200 bg-teal-50/30 p-5">
      <h2 className="font-display text-lg font-semibold">Edit details</h2>
      <div>
        <Label>Feature</Label>
        <Select value={featureId} onChange={(e) => setFeatureId(e.target.value)}>
          <option value="">No feature</option>
          {features.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Expected</Label>
          <Textarea value={expectedResult} onChange={(e) => setExpectedResult(e.target.value)} rows={2} />
        </div>
        <div>
          <Label>Actual</Label>
          <Textarea value={actualResult} onChange={(e) => setActualResult(e.target.value)} rows={2} />
        </div>
      </div>
      <div>
        <Label>Reproduction</Label>
        <Textarea
          value={reproductionSteps}
          onChange={(e) => setReproductionSteps(e.target.value)}
          rows={3}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="secondary" onClick={cancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
