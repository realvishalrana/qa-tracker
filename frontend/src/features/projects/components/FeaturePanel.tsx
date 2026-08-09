import type { Feature } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Form';

type FeaturesProps = {
  features: Feature[];
  canAdd: boolean;
  featureName: string;
  onFeatureNameChange: (v: string) => void;
  onAddFeature: (e: React.FormEvent) => void;
};

export function FeaturePanel({
  features,
  canAdd,
  featureName,
  onFeatureNameChange,
  onAddFeature,
}: FeaturesProps) {
  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-semibold">Features</h2>
      <ul className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        {features.map((f) => (
          <li key={f.id} className="flex justify-between text-sm">
            <span>{f.name}</span>
            <span className="text-slate-500">{f._count?.bugs ?? 0} bugs</span>
          </li>
        ))}
        {!features.length && <li className="text-sm text-slate-500">No features yet.</li>}
      </ul>
      {canAdd && (
        <form onSubmit={onAddFeature} className="flex gap-2">
          <Input
            value={featureName}
            onChange={(e) => onFeatureNameChange(e.target.value)}
            placeholder="Feature name"
            required
          />
          <Button type="submit">Add</Button>
        </form>
      )}
    </div>
  );
}
