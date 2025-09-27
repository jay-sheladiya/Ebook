import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';

const BookForm = ({ isOpen, onClose, books, setBooks, editingBook, setEditingBook }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', author: '', category: '', description: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        category: editingBook.category,
        description: editingBook.description || '',
        content: editingBook.content || ''
      });
      setImagePreview(editingBook.image || null);
    } else {
      setFormData({ title: '', author: '', category: '', description: '', content: '' });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [editingBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(k => data.append(k, formData[k]));
      if (imageFile) data.append('image', imageFile);

      let response;
      if (editingBook) {
        response = await axiosInstance.put(`/api/books/${editingBook._id}`, data, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBooks(books.map(b => b._id === response.data._id ? response.data : b));
      } else {
        response = await axiosInstance.post('/api/books', data, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBooks([...books, response.data]);
      }

      onClose();
      setEditingBook(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save book.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-5xl p-6 rounded-xl shadow-lg grid grid-cols-2 gap-4">
        <h2 className="col-span-2 text-2xl font-bold text-center mb-4">{editingBook ? 'Edit Book' : 'Add Book'}</h2>

        <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="p-2 border rounded col-span-1" required />
        <input type="text" placeholder="Author" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="p-2 border rounded col-span-1" required />
        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="p-2 border rounded col-span-1" required>
          <option value="">Select Category</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
        </select>

        

        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="p-2 border rounded col-span-2" rows="2" />
        <textarea placeholder="Content" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="p-2 border rounded col-span-2" rows="4" />

        <div className="col-span-2 flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
          <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingBook ? 'Update' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
