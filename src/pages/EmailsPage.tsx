import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Email } from '../types';
import { Plus, X, Edit2 } from 'lucide-react';

export function EmailsPage() {
  const [emails, setEmails] = useLocalStorage<Email[]>('emails', []);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    if (editingId) {
      setEmails(emails.map(email => 
        email.id === editingId 
          ? { ...email, address, notes }
          : email
      ));
      setEditingId(null);
    } else {
      const newEmail: Email = {
        id: crypto.randomUUID(),
        address,
        notes,
        createdAt: Date.now(),
      };
      setEmails([...emails, newEmail]);
    }

    setAddress('');
    setNotes('');
  };

  const startEditing = (email: Email) => {
    setEditingId(email.id);
    setAddress(email.address);
    setNotes(email.notes);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Emails</h2>

      <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={4}
              placeholder="Add notes about this contact"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          <Plus size={20} />
          {editingId ? 'Update Email' : 'Add Email'}
        </button>
      </form>

      <div className="space-y-4">
        {emails.map((email) => (
          <div key={email.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold dark:text-white">{email.address}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{email.notes}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(email)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => setEmails(emails.filter(e => e.id !== email.id))}
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