import { ref, inject, computed, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import type { QDialogOptions, QAjaxBar } from 'quasar';
import type { Ref } from 'vue';

interface FetcherOptions {
  errorMessage?: string;
  showLoading?: boolean;
}

const defaultOptions: Required<FetcherOptions> = {
  errorMessage: 'An error occurred while fetching data.',
  showLoading: true,
};

/**
 * A composable function to fetch data asynchronously, manage loading state,
 * and handle errors with retry/cancel options. The page will not render until
 * data is successfully fetched. On error, shows a modal with retry and cancel
 * options. Cancel redirects to the main page.
 *
 * @param fetchFn - The async function that fetches the data. It should return the data directly on success or throw an error on failure.
 * @param options - Configuration options for the fetcher
 * @returns An object containing reactive refs for data and a function to trigger the fetch.
 */
export function useDataFetcher<T>(
  fetchFn: () => Promise<T>,
  options: Partial<FetcherOptions> = {},
) {
  const $q = useQuasar();
  const router = useRouter();
  const loadingBar = inject<Ref<QAjaxBar | null>>('loadingBar');
  const mergedOptions = { ...defaultOptions, ...options } as Required<FetcherOptions>;
  const data = ref<T | null>(null);
  const activeRequests = ref(0);
  const loading = computed(() => activeRequests.value > 0);
  const isProgressBarRunning = ref(false);

  const startProgressBar = () => {
    if (loadingBar?.value && !isProgressBarRunning.value) {
      loadingBar.value.start();
      isProgressBarRunning.value = true;
    }
  };

  const stopProgressBar = () => {
    if (loadingBar?.value && isProgressBarRunning.value) {
      loadingBar.value.stop();
      isProgressBarRunning.value = false;
    }
  };

  /**
   * Shows an error dialog with retry and cancel options.
   * Cancel redirects to the main page.
   */
  const showErrorDialog = (errorMessage: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const dialogOptions: QDialogOptions = {
        title: 'Error',
        message: errorMessage,
        persistent: true,
        ok: {
          label: 'Retry',
          color: 'primary',
          flat: true,
          noCaps: true,
        },
        cancel: {
          label: 'Cancel',
          color: 'grey',
          flat: true,
          noCaps: true,
        },
      };

      $q.dialog(dialogOptions)
        .onOk(() => {
          resolve(true); // Retry
        })
        .onCancel(() => {
          void router.push({ name: 'index' });
          resolve(false); // Cancel
        });
    });
  };

  /**
   * Creates a timeout promise that rejects after specified milliseconds
   */
  const createTimeout = (ms: number): Promise<never> => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout. The operation took too long.'));
      }, ms);
    });
  };

  /**
   * Loads data with automatic retry on error and 6-second timeout.
   * Blocks until data is successfully fetched or user cancels.
   */
  const loadData = async (): Promise<void> => {
    const TIMEOUT_MS = 6000; // 6 seconds
    let shouldRetry = true;
    activeRequests.value += 1;
    const isFirstActiveRequest = activeRequests.value === 1;

    if (mergedOptions.showLoading && isFirstActiveRequest) {
      // In early lifecycle hooks (e.g. onBeforeMount), template refs may not be ready yet.
      await nextTick();
      startProgressBar();
    }

    try {
      while (shouldRetry) {
        // Show loading overlay
        if (mergedOptions.showLoading) {
          // Keep trying until the provided ref becomes available.
          if (activeRequests.value > 0) {
            startProgressBar();
          }

          $q.loading.show({
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            spinnerSize: 0,
            message: '',
          });
        }

        try {
          // Race between fetch and timeout
          data.value = await Promise.race([fetchFn(), createTimeout(TIMEOUT_MS)]);
          shouldRetry = false; // Success, exit loop
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : mergedOptions.errorMessage;

          // Hide loading overlay on error before showing dialog
          if (mergedOptions.showLoading) {
            $q.loading.hide();
          }

          // Show error dialog and wait for user decision
          shouldRetry = await showErrorDialog(errorMessage);
        } finally {
          // Hide loading overlay after each attempt
          if (mergedOptions.showLoading) {
            $q.loading.hide();
          }
        }
      }
    } finally {
      activeRequests.value = Math.max(0, activeRequests.value - 1);

      if (mergedOptions.showLoading && activeRequests.value === 0) {
        stopProgressBar();
      }
    }
  };

  return {
    data,
    loading,
    loadData,
  };
}
