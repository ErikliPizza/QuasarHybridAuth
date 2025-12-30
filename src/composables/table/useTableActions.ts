import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

interface UseTableActionsOptions {
  apiUrl: string;
  onRefresh?: () => void;
  confirmTitle?: string;
  confirmMessage?: string;
}

export function useTableActions({
  apiUrl,
  onRefresh,
  confirmTitle = 'Silme Onayı',
  confirmMessage = 'Bu kaydı silmek istediğinize emin misiniz?',
}: UseTableActionsOptions) {
  const $q = useQuasar();
  const baseUrl = apiUrl.split('?')[0];

  function defaultDelete<T extends { id: string | number }>(row: T) {
    if (!row?.id) return;

    $q.dialog({
      title: confirmTitle,
      dark: true,
      persistent: true,
      html: true,
      message: `
        <div style="font-size:14px;line-height:1.6;color:#ccc">
          <b style="color:#ff5252">Bu işlem geri alınamaz!</b><br/>
          ${confirmMessage}
        </div>
      `,
      ok: { label: 'Sil', color: 'negative', unelevated: true },
      cancel: { label: 'Vazgeç', flat: true },
    }).onOk(() => {
      api
        .delete(`${baseUrl}/${row.id}`)
        .then(() => {
          onRefresh?.();
        })
        .catch((err) => {
          console.error('Silme işlemi başarısız:', err);
        });
    });
  }

  return {
    defaultDelete,
  };
}
