'use client';

import { useState } from 'react';
import type { BugFormValues } from '@/features/projects/hooks/useProjectDetail';
import type { Feature } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select, Textarea } from '@/components/ui/Form';
import { ISSUE_TYPES, PRIORITIES, SEVERITIES } from '@/types';
import { createBugSchema, formatZodError } from '@/lib/validation';

type BugFormProps = {
  form: BugFormValues;
  features: Feature[];
  onChange: (next: BugFormValues) => void;
  onSubmit: (form: BugFormValues) => Promise<void>;
};

export function CreateBugForm({ form, features, onChange, onSubmit }: BugFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const parsed = createBugSchema.safeParse(form);
        if (!parsed.success) {
          setError(formatZodError(parsed.error));
          return;
        }
        setSaving(true);
        setError(null);
        try {
          await onSubmit({
            ...parsed.data,
            description: parsed.data.description || '',
            featureId: parsed.data.featureId || null,
            expectedResult: parsed.data.expectedResult || '',
            actualResult: parsed.data.actualResult || '',
            reproductionSteps: parsed.data.reproductionSteps || '',
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to create bug');
        } finally {
          setSaving(false);
        }
      }}
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-5"
    >
      <h2 className="font-display text-xl font-semibold">Report bug</h2>
      <div>
        <Label>Title</Label>
        <Input
          value={form.title}
          onChange={(e) => onChange({ ...form, title: e.target.value })}
          minLength={3}
          required
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Feature</Label>
          <Select
            value={form.featureId || ''}
            onChange={(e) => onChange({ ...form, featureId: e.target.value || null })}
          >
            <option value="">No feature</option>
            {features.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Type</Label>
          <Select
            value={form.issueType}
            onChange={(e) => onChange({ ...form, issueType: e.target.value })}
          >
            {ISSUE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Severity</Label>
          <Select
            value={form.severity}
            onChange={(e) => onChange({ ...form, severity: e.target.value })}
          >
            {SEVERITIES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Priority</Label>
          <Select
            value={form.priority}
            onChange={(e) => onChange({ ...form, priority: e.target.value })}
          >
            {PRIORITIES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Expected</Label>
          <Textarea
            value={form.expectedResult || ''}
            onChange={(e) => onChange({ ...form, expectedResult: e.target.value })}
            rows={2}
            placeholder="What should happen"
          />
        </div>
        <div>
          <Label>Actual</Label>
          <Textarea
            value={form.actualResult || ''}
            onChange={(e) => onChange({ ...form, actualResult: e.target.value })}
            rows={2}
            placeholder="What actually happened"
          />
        </div>
      </div>
      <div>
        <Label>Reproduction</Label>
        <Textarea
          value={form.reproductionSteps || ''}
          onChange={(e) => onChange({ ...form, reproductionSteps: e.target.value })}
          rows={3}
          placeholder="Steps to reproduce"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={saving}>
        {saving ? 'Creating...' : 'Create bug'}
      </Button>
    </form>
  );
}
