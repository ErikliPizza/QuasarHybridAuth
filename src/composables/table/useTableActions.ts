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
      dark: false,
      persistent: true,
      html: true,
      message: `
        <div style="font-size:14px;line-height:1.6;color:#37474F">
          <b style="color:#26A69A">Bu işlem geri alınamaz</b><br/>
          ${confirmMessage}
        </div>
      `,
      ok: { label: 'Sil', color: 'negative', unelevated: true },
      cancel: { label: 'Vazgeç', color: 'primary', flat: true },
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
