import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { File, FileText, Upload } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { firestore, storage, serverTimestamp } from '../../services/firebase';
import { collection, query, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DocumentList = () => {
  const { subjectId } = useParams();
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docsRef = collection(firestore, 'users', user.uid, 'subjects', subjectId, 'documents');
        const q = query(docsRef);
        const snapshot = await getDocs(q);
        const fetchedDocs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDocuments(fetchedDocs);
      } catch (err) {
        setError('Failed to fetch documents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [subjectId, user]);

  const handleFileUpload = async (file) => {
    if (documents.length >= 4) {
      setError('Maximum limit of 4 documents reached');
      return;
    }

    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF and TXT files are allowed');
      return;
    }

    try {
      const storageRef = ref(storage, `users/${user.uid}/documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const docRef = await addDoc(collection(firestore, 'users', user.uid, 'subjects', subjectId, 'documents'), {
        name: file.name,
        type: file.type,
        size: file.size,
        url: downloadURL,
        createdAt: serverTimestamp(),
        summary: '',
        status: 'processing'
      });

      setDocuments(prev => [...prev, {
        id: docRef.id,
        name: file.name,
        type: file.type,
        size: file.size,
        url: downloadURL,
        status: 'processing'
      }]);

      setIsUploadModalOpen(false);
    } catch (err) {
      setError('Failed to upload document');
    }
  };

  const handleDelete = async (docId) => {
    try {
      await deleteDoc(doc(firestore, 'users', user.uid, 'subjects', subjectId, 'documents', docId));
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          disabled={documents.length >= 4}
          className="flex items-center"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
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
      ) : documents.length === 0 ? (
        <Card className="text-center py-12">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No documents
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload a document to get started
          </p>
          <div className="mt-6">
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center mx-auto"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <File className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-500">
                      {(doc.size / 1024).toFixed(2)} KB • {
                        doc.status === 'processing' ? 
                        'Processing...' : 
                        'Ready'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentDocument(doc);
                      setIsViewModalOpen(true);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Document"
      >
        <div className="p-6">
          <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-400">
                PDF or TXT up to 10MB
              </span>
            </label>
          </div>
        </div>
      </Modal>

            {/* View Document Modal */}
            <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={currentDocument?.name}
        size="lg"
      >
        <div className="p-6">
          {currentDocument?.summary ? (
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <p className="text-gray-700">{currentDocument.summary}</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No summary available
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                The document is still being processed.
              </p>
            </div>
          )}

          <div className="mt-6">
            <a
              href={currentDocument?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <File className="w-4 h-4 mr-2" />
              View Full Document
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentList;