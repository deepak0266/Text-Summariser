import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, FileText, MoreVertical, Edit } from 'lucide-react';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SubjectCard = ({ subject, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editName, setEditName] = useState(subject.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      await firebase.firestore()
        .collection('users')
        .doc(subject.userId)
        .collection('subjects')
        .doc(subject.id)
        .update({
          name: editName
        });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating subject:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card 
        hover 
        clickable 
        className="relative group"
        onClick={() => navigate(`/subjects/${subject.id}`)}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {subject.documentsCount || 0} documents
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-600 rounded-full"
                style={{ 
                  width: `${(subject.documentsCount || 0) / 4 * 100}%`,
                  transition: 'width 0.3s ease-in-out'
                }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {4 - (subject.documentsCount || 0)} slots remaining
            </p>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Subject"
      >
        <div className="p-6">
          <p className="text-gray-700">
            Are you sure you want to delete "{subject.name}"? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onDelete();
                setIsDeleteModalOpen(false);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Subject"
      >
        <div className="p-6">
          <Input
            label="Subject Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Enter subject name"
          />
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEdit}
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SubjectCard;