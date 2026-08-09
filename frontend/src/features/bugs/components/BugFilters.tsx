'use client';

import { Input, Label, Select } from '@/components/ui/Form';
import { BUG_STATUSES, PRIORITIES, SEVERITIES } from '@/types';

type Props = {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

export function BugFilters({ values, onChange }: Props) {
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-4">
      <div>
        <Label>Search</Label>
        <Input
          placeholder="Key or title"
          value={values.q || ''}
          onChange={(e) => onChange('q', e.target.value)}
        />
      </div>
      <div>
        <Label>Status</Label>
        <Select value={values.status || ''} onChange={(e) => onChange('status', e.target.value)}>
          <option value="">All</option>
          {BUG_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Severity</Label>
        <Select value={values.severity || ''} onChange={(e) => onChange('severity', e.target.value)}>
          <option value="">All</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Priority</Label>
        <Select value={values.priority || ''} onChange={(e) => onChange('priority', e.target.value)}>
          <option value="">All</option>
          {PRIORITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
