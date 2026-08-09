'use client';

import { useCallback, useEffect, useState } from 'react';
import { bugsApi } from '@/features/bugs/services/bugsApi';
import { useToast } from '@/components/ui/Toast';
import { withMutationToast } from '@/lib/mutationToast';
import type { BugStatus } from '@/types';

export function useBugStatus(bugId: string, initialStatus?: BugStatus) {
  const toast = useToast();
  const [status, setStatus] = useState<BugStatus | ''>(initialStatus || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialStatus) setStatus(initialStatus);
  }, [initialStatus]);

  const save = useCallback(async () => {
    if (!status || !bugId) return;
    setSaving(true);
    try {
      await withMutationToast(
        toast,
        () => bugsApi.updateStatus(bugId, status),
        { success: 'Status updated' }
      );
    } finally {
      setSaving(false);
    }
  }, [bugId, status, toast]);

  return { status, setStatus, saving, save };
}
