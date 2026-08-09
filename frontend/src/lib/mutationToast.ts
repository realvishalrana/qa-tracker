import { ApiError } from '@/lib/apiClient';

type ToastApi = { success: (m: string) => void; error: (m: string) => void };

export async function withMutationToast<T>(
  toast: ToastApi,
  action: () => Promise<T>,
  messages: { success: string; error?: string }
): Promise<T> {
  try {
    const result = await action();
    toast.success(messages.success);
    return result;
  } catch (err) {
    const message =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : messages.error || 'Something went wrong';
    toast.error(message);
    throw err;
  }
}
