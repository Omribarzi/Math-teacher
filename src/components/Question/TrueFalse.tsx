import './TrueFalse.css';

interface Props {
  onSelect: (answer: string) => void;
  disabled: boolean;
  correctAnswer?: string;
}

export default function TrueFalse({ onSelect, disabled, correctAnswer }: Props) {
  return (
    <div className="tf-options">
      <button
        className={`tf-option tf-true ${correctAnswer === 'נכון' ? 'tf-correct' : ''}`}
        onClick={() => onSelect('נכון')}
        disabled={disabled}
      >
        ✓ נכון
      </button>
      <button
        className={`tf-option tf-false ${correctAnswer === 'לא נכון' ? 'tf-correct' : ''}`}
        onClick={() => onSelect('לא נכון')}
        disabled={disabled}
      >
        ✗ לא נכון
      </button>
    </div>
  );
}
