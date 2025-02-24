import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import SubjectCard from './SubjectCard';
import UploadModal from './UploadModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // Fetch subjects from Firebase
        const subjectsRef = firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .collection('subjects');
        
        const snapshot = await subjectsRef.get();
        const fetchedSubjects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setSubjects(fetchedSubjects);
      } catch (err) {
        setError('Failed to fetch subjects');
        console.error('Error fetching subjects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [user]);

  const handleCreateSubject = async (newSubject) => {
    if (subjects.length >= 5) {
      setError('Maximum limit of 5 subjects reached');
      return;
    }
    
    try {
      const subjectRef = await firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .collection('subjects')
        .add({
          name: newSubject.name,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          documentsCount: 0
        });

      const newSubjectData = {
        id: subjectRef.id,
        name: newSubject.name,
        documentsCount: 0
      };

      setSubjects(prev => [...prev, newSubjectData]);
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to create subject');
      console.error('Error creating subject:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Subjects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your subjects and documents
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={subjects.length >= 5}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Subject
        </Button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No subjects yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new subject
          </p>
          <div className="mt-6">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Subject
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onDelete={() => handleDeleteSubject(subject.id)}
            />
          ))}
        </div>
      )}

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubject}
        type="subject"
      />
    </div>
  );
};

export default Dashboard;