import './MultipleChoice.css';

interface Props {
  options: string[];
  onSelect: (answer: string) => void;
  disabled: boolean;
  correctAnswer?: string;
}

export default function MultipleChoice({ options, onSelect, disabled, correctAnswer }: Props) {
  return (
    <div className="mc-options">
      {options.map((option, i) => {
        let className = 'mc-option';
        if (correctAnswer) {
          if (option === correctAnswer) className += ' mc-correct';
        }
        return (
          <button
            key={`${option}-${i}`}
            className={className}
            onClick={() => onSelect(option)}
            disabled={disabled}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
