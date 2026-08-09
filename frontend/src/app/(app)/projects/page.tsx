'use client';

import { useState } from 'react';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { CreateProjectForm, ProjectCardGrid } from '@/features/projects/components/ProjectList';
import { useAuth } from '@/providers/AuthProvider';
import { PERMISSIONS } from '@/types';
import { createProjectSchema, formatZodError } from '@/lib/validation';

export default function ProjectsPage() {
  const { projects, loading, error, create } = useProjects();
  const { hasPermission } = useAuth();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Projects</h1>
        <p className="mt-1 text-slate-600">Organize bugs and releases by product area.</p>
      </div>

      {hasPermission(PERMISSIONS.PROJECT_CREATE) && (
        <CreateProjectForm
          name={name}
          projectKey={key}
          description={description}
          saving={saving}
          formError={formError}
          onNameChange={setName}
          onKeyChange={setKey}
          onDescriptionChange={setDescription}
          onSubmit={async (e) => {
            e.preventDefault();
            const parsed = createProjectSchema.safeParse({
              name,
              key: key.toUpperCase(),
              description,
            });
            if (!parsed.success) {
              setFormError(formatZodError(parsed.error));
              return;
            }
            setSaving(true);
            setFormError(null);
            try {
              await create(parsed.data);
              setName('');
              setKey('');
              setDescription('');
            } catch (err) {
              setFormError(err instanceof Error ? err.message : 'Failed to create');
            } finally {
              setSaving(false);
            }
          }}
        />
      )}

      {loading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ProjectCardGrid projects={projects} />
    </div>
  );
}
