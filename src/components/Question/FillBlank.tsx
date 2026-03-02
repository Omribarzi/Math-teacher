import { useState } from 'react';
import './FillBlank.css';

interface Props {
  onSubmit: (answer: string | number) => void;
  disabled: boolean;
}

export default function FillBlank({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    // Try to parse as number
    const num = Number(value.trim());
    onSubmit(isNaN(num) ? value.trim() : num);
  };

  return (
    <form className="fill-blank" onSubmit={handleSubmit}>
      <input
        type="text"
        inputMode="decimal"
        className="fill-blank-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="הקלד תשובה..."
        disabled={disabled}
        autoFocus
        dir="ltr"
      />
      <button
        type="submit"
        className="fill-blank-submit"
        disabled={disabled || !value.trim()}
      >
        בדוק ←
      </button>
    </form>
  );
}
