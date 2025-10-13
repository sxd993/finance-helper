import { useCallback, useState } from 'react';

// Максимально простой локальный хук модалки.
// Поддерживает сигнатуру useModal(id, scope?) для совместимости, но
// работает локально без Redux — управляет только открытием/закрытием.
export function useModal(_id?: string, _scope?: string | number) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle };
}
