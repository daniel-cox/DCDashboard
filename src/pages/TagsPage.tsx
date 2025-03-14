import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Tag } from '../types';
import { Plus, X, Edit2 } from 'lucide-react';

export function TagsPage() {
  const [tags, setTags] = useLocalStorage<Tag[]>('tags', []);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingId) {
      setTags(tags.map(tag => 
        tag.id === editingId 
          ? { ...tag, name, color }
          : tag
      ));
      setEditingId(null);
    } else {
      const newTag: Tag = {
        id: crypto.randomUUID(),
        name,
        color,
        createdAt: Date.now(),
      };
      setTags([...tags, newTag]);
    }

    setName('');
    setColor('#3B82F6');
  };

  const startEditing = (tag: Tag) => {
    setEditingId(tag.id);
    setName(tag.name);
    setColor(tag.color);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Tags</h2>

      <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tag Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter tag name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-2 border rounded-md font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="#000000"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          <Plus size={20} />
          {editingId ? 'Update Tag' : 'Add Tag'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tags.map((tag) => (
          <div key={tag.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: tag.color }}
                />
                <span 
                  className="px-2 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(tag)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => setTags(tags.filter(t => t.id !== tag.id))}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}