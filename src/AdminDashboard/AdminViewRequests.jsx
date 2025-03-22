import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(''); // Track any errors during fetching

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tollPassRequests'));
        setRequests(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setLoading(false); // Stop loading when data is fetched
      } catch (err) {
        setError('Error fetching requests. Please try again later.');
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this request?')) {
      const requestRef = doc(db, 'tollPassRequests', id);
      try {
        await updateDoc(requestRef, { status: 'Approved' });
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === id ? { ...request, status: 'Approved' } : request
          )
        );
      } catch (err) {
        setError('Error updating the request status. Please try again later.');
      }
    }
  };

  const handleDecline = async (id) => {
    if (window.confirm('Are you sure you want to decline this request?')) {
      const requestRef = doc(db, 'tollPassRequests', id);
      try {
        await updateDoc(requestRef, { status: 'Declined' });
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === id ? { ...request, status: 'Declined' } : request
          )
        );
      } catch (err) {
        setError('Error updating the request status. Please try again later.');
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading requests...</div>;
  }

  const listStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
    alignItems: 'center', // Center the content horizontally in the list
    width: '100%',
    padding: '0 10px', // Add padding to avoid the content sticking to the sides
    boxSizing: 'border-box',
  };

  const listItemStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '12px',
    borderBottom: '1px solid #ddd',
    marginBottom: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    width: '100%', // Ensure full width
    maxWidth: '900px', // Limit the maximum width of items
    textAlign: 'left', // Align text to the left
    boxSizing: 'border-box', // Prevents any overflow issues
    color: 'black',
    margin: '0 auto', // Ensure the content is centered within the container
  };

  const buttonStyle = {
    padding: '6px 12px',
    marginLeft: '5px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    width: '100px', // Set fixed width for consistency
    marginBottom: '5px',
  };

  const approveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50', // Green
    color: '#fff',
  };

  const declineButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f44336', // Red
    color: '#fff',
  };

  const errorStyle = {
    color: 'red',
    marginTop: '10px',
    textAlign: 'center',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    minHeight: '100vh',
    width: '100%', // Ensures full width usage
    maxWidth: '100vw', // Limits content width for readability
    margin: '0 auto', // Centers content
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
  };
  

  return (
    <div style={containerStyle}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' ,color:'black'}}>Requests from users</h3>
      {error && <p style={errorStyle}>{error}</p>}
      <div style={listStyle}>
        {requests.map((request) => (
          <div key={request.id} style={listItemStyle}>
            <div>
              <p><strong>Vehicle Number:</strong> {request.vehicleNumber}</p>
              <p><strong>From:</strong> {request.from}</p>
              <p><strong>To:</strong> {request.to}</p>
              <p><strong>Date:</strong> {request.date}</p>
              <p><strong>Status:</strong> {request.status}</p>
            </div>
            <div>
              <button
                onClick={() => handleApprove(request.id)}
                style={approveButtonStyle}
              >
                Approve
              </button>
              <button
                onClick={() => handleDecline(request.id)}
                style={declineButtonStyle}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminViewRequests;
