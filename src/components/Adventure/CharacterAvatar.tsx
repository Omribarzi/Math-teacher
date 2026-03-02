import './CharacterAvatar.css';

const avatars: Record<string, string> = {
  wizard: '🧙',
  knight: '🦸',
  robot: '🤖',
  cat: '🐱',
  dragon: '🐲',
  astronaut: '👨‍🚀',
};

interface Props {
  avatarId: string;
  size?: 'small' | 'medium' | 'large';
  selectable?: boolean;
  onSelect?: (id: string) => void;
}

export default function CharacterAvatar({ avatarId, size = 'medium', selectable, onSelect }: Props) {
  if (selectable) {
    return (
      <div className="avatar-selection">
        {Object.entries(avatars).map(([id, emoji]) => (
          <button
            key={id}
            className={`avatar-option ${id === avatarId ? 'selected' : ''}`}
            onClick={() => onSelect?.(id)}
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`avatar avatar-${size}`}>
      {avatars[avatarId] ?? '🧙'}
    </div>
  );
}

export { avatars };
