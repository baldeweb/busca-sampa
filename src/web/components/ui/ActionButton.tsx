import { type ReactNode } from 'react';
import { AppButton } from './AppButton';

interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  size?: 'xs' | 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function ActionButton({ children, onClick, size = 'sm', disabled, className = '', type = 'button' }: ActionButtonProps) {
  return (
    <AppButton
      onClick={onClick}
      variant="primary"
      size={size}
      disabled={disabled}
      className={className}
      type={type}
    >
      {children}
    </AppButton>
  );
}

export default ActionButton;
