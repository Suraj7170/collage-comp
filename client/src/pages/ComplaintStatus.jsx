import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const ComplaintStatus = () => {
  const [token, setToken] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check for token in URL query params
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      fetchComplaint(tokenParam);
    }
  }, [location]);

  const fetchComplaint = async (token) => {
    setLoading(true);
    try {
      const res = await api.get(`/complaints/${token}`);
      setComplaint(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch complaint');
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token.trim()) {
      fetchComplaint(token.trim());
    }
  };

  return (
    <>
      <Helmet>
        <title>Complaint Status | BIT Mesra Complaint System</title>
      </Helmet>
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Check Complaint Status</h1>
          
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter complaint token"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
          
          {complaint && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Complaint Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Token Number</h3>
                  <p className="mt-1 text-sm text-gray-900 font-medium">{complaint.token}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="mt-1 text-sm text-gray-900">{complaint.type}</p>
                </div>
                
                {complaint.type === 'Hostel' && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Hostel No</h3>
                      <p className="mt-1 text-sm text-gray-900">Hostel {complaint.hostelNo}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Room No</h3>
                      <p className="mt-1 text-sm text-gray-900">{complaint.roomNo}</p>
                    </div>
                  </>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Problem Type</h3>
                  <p className="mt-1 text-sm text-gray-900">{complaint.subType}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm text-gray-900">{complaint.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date Filed</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(complaint.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className={`mt-1 text-sm font-medium ${
                    complaint.status === 'Pending' ? 'text-yellow-600' : 
                    complaint.status === 'In Progress' ? 'text-blue-600' : 
                    complaint.status === 'Resolved' ? 'text-green-600' : 
                    'text-red-600'
                  }`}>
                    {complaint.status}
                  </p>
                </div>
                
                {complaint.remarks && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Remarks</h3>
                    <p className="mt-1 text-sm text-gray-900">{complaint.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ComplaintStatus;