'use client';

type WishlistSelectButtonProps = {
  id: string;
  name: string;
  description: string;
  emoji: string; // Use emoji instead of image
  onSelect: (id: string) => void;
};

export function WishlistSelectButton({
  id,
  name,
  description,
  emoji,
  onSelect,
}: WishlistSelectButtonProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      className="border rounded-md p-4 hover:shadow-lg transition-shadow duration-300 text-left w-full"
    >
      <div className="flex items-center">
        <div className="text-6xl mr-4">{emoji || '🎁'}</div> {/* Display the emoji */}
        <div>
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );
}
