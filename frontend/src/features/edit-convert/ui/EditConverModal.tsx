import type { Convert } from "@/entities/convert";
import { formatPrice } from "@/shared/utils/formatPrice";

interface EditConvertModalProps
  extends Pick<Convert, "id" | "name" | "overall_limit" | "current_amount" | "target_amount" | "initial_investment"> {
  convert_type_limit?: number | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const EditConvertModal = ({
  id,
  name,
  overall_limit,
  current_amount,
  convert_type_limit,
  onClose,
}: EditConvertModalProps) => {
  const handleClose = onClose ?? (() => undefined);

  return (
    <div>
      <h1>Лимит для типа {convert_type_limit != null ? formatPrice(convert_type_limit) : "—"}</h1>
      <h2>{name}</h2>
      <p>ID: {id}</p>
      <p>Лимит: {overall_limit != null ? formatPrice(overall_limit) : "—"}</p>
      <p>Баланс: {formatPrice(current_amount)}</p>
      <button onClick={handleClose}>Закрыть</button>
    </div>
  );
};
