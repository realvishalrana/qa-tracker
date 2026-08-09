import Link from 'next/link';
import type { Project } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Form';

type CreateProps = {
  name: string;
  projectKey: string;
  description: string;
  saving: boolean;
  formError: string | null;
  onNameChange: (v: string) => void;
  onKeyChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function CreateProjectForm({
  name,
  projectKey,
  description,
  saving,
  formError,
  onNameChange,
  onKeyChange,
  onDescriptionChange,
  onSubmit,
}: CreateProps) {
  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-4">
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => onNameChange(e.target.value)} required />
      </div>
      <div>
        <Label>Key</Label>
        <Input
          value={projectKey}
          onChange={(e) => onKeyChange(e.target.value.toUpperCase())}
          placeholder="DEMO"
          required
        />
      </div>
      <div className="md:col-span-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => onDescriptionChange(e.target.value)} rows={1} />
      </div>
      {formError && <p className="text-sm text-red-600 md:col-span-4">{formError}</p>}
      <div className="md:col-span-4">
        <Button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create project'}
        </Button>
      </div>
    </form>
  );
}

export function ProjectCardGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-xs text-teal-700">{project.key}</p>
              <h2 className="mt-1 font-display text-xl font-semibold text-slate-900">{project.name}</h2>
            </div>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">{project.status}</span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm text-slate-600">{project.description || 'No description'}</p>
          <div className="mt-4 flex gap-4 text-xs text-slate-500">
            <span>{project._count?.bugs ?? 0} bugs</span>
            <span>{project._count?.features ?? 0} features</span>
            <span>{project._count?.members ?? 0} members</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
