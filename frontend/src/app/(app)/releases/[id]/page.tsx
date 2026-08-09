'use client';

import { useParams } from 'next/navigation';
import { useReleaseDetail } from '@/features/releases/hooks/useReleases';
import { ReleaseDetailView } from '@/features/releases/components/ReleaseViews';
import { useAuth } from '@/providers/AuthProvider';
import { PERMISSIONS } from '@/types';

export default function ReleaseDetailPage() {
  const params = useParams<{ id: string }>();
  const { hasPermission } = useAuth();
  const { release, loading, error, publish, linkBugs, unlinkBug } = useReleaseDetail(params.id);

  if (error) return <p className="text-red-600">{error}</p>;
  if (loading || !release) return <p className="text-slate-500">Loading...</p>;

  const canManage = hasPermission(PERMISSIONS.RELEASE_MANAGE);

  return (
    <ReleaseDetailView
      release={release}
      canManage={canManage}
      canPublish={canManage}
      onPublish={() => void publish()}
      onLinkBugs={linkBugs}
      onUnlinkBug={(bugId) => void unlinkBug(bugId)}
    />
  );
}
