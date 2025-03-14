import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link, Tag } from '../types';
import { ExternalLink, Plus, X, Edit2 } from 'lucide-react';

export function LinksPage() {
  const [links, setLinks] = useLocalStorage<Link[]>('links', []);
  const [tags] = useLocalStorage<Tag[]>('tags', []);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    if (editingId) {
      setLinks(links.map(link => 
        link.id === editingId 
          ? { ...link, name, url, tags: selectedTags }
          : link
      ));
      setEditingId(null);
    } else {
      const newLink: Link = {
        id: crypto.randomUUID(),
        name,
        url,
        tags: selectedTags,
        createdAt: Date.now(),
      };
      setLinks([...links, newLink]);
    }

    setName('');
    setUrl('');
    setSelectedTags([]);
  };

  const startEditing = (link: Link) => {
    setEditingId(link.id);
    setName(link.name);
    setUrl(link.url);
    setSelectedTags(link.tags);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Links</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter link name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter URL"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTags(prev => 
                  prev.includes(tag.id) 
                    ? prev.filter(id => id !== tag.id)
                    : [...prev, tag.id]
                )}
                className={`px-3 py-1 rounded-full text-sm transition-colors`}
                style={{
                  backgroundColor: selectedTags.includes(tag.id) ? tag.color : `${tag.color}20`,
                  color: selectedTags.includes(tag.id) ? 'white' : tag.color
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          <Plus size={20} />
          {editingId ? 'Update Link' : 'Add Link'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link) => (
          <div key={link.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold dark:text-white">{link.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(link)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => setLinks(links.filter(l => l.id !== link.id))}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Visit Link
            </a>
            <div className="mt-4 flex flex-wrap gap-2">
              {link.tags.map((tagId) => {
                const tag = tags.find(t => t.id === tagId);
                return tag ? (
                  <span
                    key={tag.id}
                    className="px-2 py-1 rounded-full text-sm text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}