import type { Project } from '@/types';

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <div>
      <p className="font-mono text-sm text-teal-700">{project.key}</p>
      <h1 className="font-display text-3xl font-semibold text-slate-900">{project.name}</h1>
      <p className="mt-1 text-slate-600">{project.description}</p>
    </div>
  );
}
