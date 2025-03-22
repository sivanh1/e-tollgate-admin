import React, { useState, useEffect } from 'react';
import { db } from './firebase/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import styled from 'styled-components';
import {
  FaTachometerAlt,
  FaPlus,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaCar,
  FaMoneyBillAlt,
  FaListAlt
} from 'react-icons/fa';

const AdminDashboard = () => {
  // Form states for adding a toll pass
  const [driverName, setDriverName] = useState('');
  // Vehicle number parts
  const [stateCode, setStateCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [series, setSeries] = useState('');
  const [uniqueNumber, setUniqueNumber] = useState('');
  
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Approved');
  
  // Vehicle type and toll amount
  const [vehicleType, setVehicleType] = useState('Bike');
  const [tollAmount, setTollAmount] = useState(200);

  // New state for submission activity indicator
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for requests, errors, search query, and loading indicator
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Set active sidebar section to 'dashboard' by default
  const [activeSection, setActiveSection] = useState('dashboard');

  // Calculate summary metrics for Dashboard section
  const totalRequests = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const declinedCount = requests.filter((r) => r.status === 'Declined').length;

  // Auto-calculate toll amount based on vehicle type
  useEffect(() => {
    let amount = 0;
    if (vehicleType === 'Bike') {
      amount = 200;
    } else if (vehicleType === 'Car') {
      amount = 300;
    } else if (vehicleType === 'Bus') {
      amount = 400;
    } else if (vehicleType === 'Lorry') {
      amount = 500;
    }
    setTollAmount(amount);
  }, [vehicleType]);

  // Function to fetch toll pass requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'tollPassRequests'));
      setRequests(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    } catch (err) {
      setError('Error fetching requests. Please try again later.');
      setLoading(false);
    }
  };

  // Fetch requests on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle adding a toll pass request
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate vehicle number parts (simple length check)
    if (stateCode.length !== 2 || districtCode.length !== 2 || series.length !== 1 || uniqueNumber.length !== 4) {
      alert('Please enter a valid vehicle number in the format: [2 letters] [2 digits] [1 letter] [4 digits].');
      return;
    }
    // Combine the vehicle number parts into one string
    const fullVehicleNumber = `${stateCode.toUpperCase()} ${districtCode} ${series.toUpperCase()} ${uniqueNumber}`;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'tollPassRequests'), {
        driverName,
        vehicleNumber: fullVehicleNumber,
        from,
        to,
        date,
        status,
        vehicleType,
        tollAmount
      });
      alert('Toll Pass Added!');
      // Clear the form fields after submission
      setDriverName('');
      setStateCode('');
      setDistrictCode('');
      setSeries('');
      setUniqueNumber('');
      setFrom('');
      setTo('');
      setDate('');
      setVehicleType('Bike'); // resets to default, tollAmount will recalc automatically
      setStatus('Approved');
      fetchRequests();
    } catch (err) {
      console.error('Error adding document: ', err);
      alert('Failed to add toll pass. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle updating a request status
  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this request?')) {
      const requestRef = doc(db, 'tollPassRequests', id);
      try {
        await updateDoc(requestRef, { status: 'Approved' });
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
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
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'Declined' } : r))
        );
      } catch (err) {
        setError('Error updating the request status. Please try again later.');
      }
    }
  };

  // Filter the requests based on active section and search query
  const filteredRequests = requests
    .filter((request) => {
      if (activeSection === 'pending') {
        return request.status === 'Pending';
      } else if (activeSection === 'approved') {
        return request.status === 'Approved';
      } else if (activeSection === 'declined') {
        return request.status === 'Declined';
      }
      // For "date" and "toll", display all requests
      return true;
    })
    .filter((request) =>
      request.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Handler for refreshing data
  const handleRefresh = () => {
    fetchRequests();
  };

  return (
    <Container>
      <Sidebar>
        <SidebarItem active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')}>
          <IconWrapper><FaTachometerAlt /></IconWrapper>
          Dashboard
        </SidebarItem>
        <SidebarItem active={activeSection === 'add'} onClick={() => setActiveSection('add')}>
          <IconWrapper><FaPlus /></IconWrapper>
          Add Pass
        </SidebarItem>
        <SidebarItem active={activeSection === 'pending'} onClick={() => setActiveSection('pending')}>
          <IconWrapper><FaHourglassHalf /></IconWrapper>
          Pending
        </SidebarItem>
        <SidebarItem active={activeSection === 'approved'} onClick={() => setActiveSection('approved')}>
          <IconWrapper><FaCheckCircle /></IconWrapper>
          Approved
        </SidebarItem>
        <SidebarItem active={activeSection === 'declined'} onClick={() => setActiveSection('declined')}>
          <IconWrapper><FaTimesCircle /></IconWrapper>
          Declined
        </SidebarItem>
        <SidebarItem active={activeSection === 'date'} onClick={() => setActiveSection('date')}>
          <IconWrapper><FaCalendarAlt /></IconWrapper>
          Date of Pass
        </SidebarItem>
        <SidebarItem active={activeSection === 'toll'} onClick={() => setActiveSection('toll')}>
          <IconWrapper><FaCar /></IconWrapper>
          Toll for Vehicle
        </SidebarItem>
        <SidebarItem active={activeSection === 'amountPaid'} onClick={() => setActiveSection('amountPaid')}>
          <IconWrapper><FaMoneyBillAlt /></IconWrapper>
          Amount Paid
        </SidebarItem>
        <SidebarItem active={activeSection === 'passHistory'} onClick={() => setActiveSection('passHistory')}>
          <IconWrapper><FaListAlt /></IconWrapper>
          Pass History
        </SidebarItem>
      </Sidebar>
      <MainContent>
        {/* Display toolbar for list-based sections (excluding Add Pass, Dashboard, Amount Paid, and Pass History) */}
        {activeSection !== 'add' &&
          activeSection !== 'dashboard' &&
          activeSection !== 'amountPaid' &&
          activeSection !== 'passHistory' && (
          <Toolbar>
            <SearchInput
              type="text"
              placeholder="Search by Vehicle Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <RefreshButton onClick={handleRefresh}>Refresh</RefreshButton>
          </Toolbar>
        )}

        {activeSection === 'dashboard' && (
          <Section>
            <SectionHeader>Dashboard Overview</SectionHeader>
            {error && <ErrorText>{error}</ErrorText>}
            {loading ? (
              <LoadingText>Loading reports...</LoadingText>
            ) : (
              <>
                <SummaryTable>
                  <tbody>
                    <SummaryRow>
                      <SummaryCell>Total Requests</SummaryCell>
                      <SummaryCell>{totalRequests}</SummaryCell>
                    </SummaryRow>
                    <SummaryRow>
                      <SummaryCell>Approved Requests</SummaryCell>
                      <SummaryCell>{approvedCount}</SummaryCell>
                    </SummaryRow>
                    <SummaryRow>
                      <SummaryCell>Pending Requests</SummaryCell>
                      <SummaryCell>{pendingCount}</SummaryCell>
                    </SummaryRow>
                    <SummaryRow>
                      <SummaryCell>Declined Requests</SummaryCell>
                      <SummaryCell>{declinedCount}</SummaryCell>
                    </SummaryRow>
                  </tbody>
                </SummaryTable>
                <DashboardImage
                  src="https://media.istockphoto.com/id/1462668333/vector/cars-passing-through-checkpoint-to-pay-road-toll-at-highway.jpg?s=612x612&w=0&k=20&c=uTrDin3fDnVjGVGNOfu0ntz9bgHKTuadRg05fOI6cGY="
                  alt="Dashboard Visual"
                />
                <ExtraHeader>Amount Paid by Vehicle</ExtraHeader>
                <StyledTable>
                  <thead>
                    <StyledTableRow>
                      <StyledTableHeaderCell>Vehicle Number</StyledTableHeaderCell>
                      <StyledTableHeaderCell>Amount Paid</StyledTableHeaderCell>
                    </StyledTableRow>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <StyledTableRow key={req.id}>
                        <StyledTableCell>{req.vehicleNumber}</StyledTableCell>
                        <StyledTableCell>{req.tollAmount}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </tbody>
                </StyledTable>
                <ExtraHeader>Vehicle Type by Vehicle Number</ExtraHeader>
                <StyledTable>
                  <thead>
                    <StyledTableRow>
                      <StyledTableHeaderCell>Vehicle Number</StyledTableHeaderCell>
                      <StyledTableHeaderCell>Vehicle Type</StyledTableHeaderCell>
                    </StyledTableRow>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <StyledTableRow key={req.id}>
                        <StyledTableCell>{req.vehicleNumber}</StyledTableCell>
                        <StyledTableCell>{req.vehicleType}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </tbody>
                </StyledTable>
                <ExtraHeader>Driver Name by Vehicle Number</ExtraHeader>
                <StyledTable>
                  <thead>
                    <StyledTableRow>
                      <StyledTableHeaderCell>Vehicle Number</StyledTableHeaderCell>
                      <StyledTableHeaderCell>Driver Name</StyledTableHeaderCell>
                    </StyledTableRow>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <StyledTableRow key={req.id}>
                        <StyledTableCell>{req.vehicleNumber}</StyledTableCell>
                        <StyledTableCell>{req.driverName}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </tbody>
                </StyledTable>
              </>
            )}
          </Section>
        )}

        {activeSection === 'amountPaid' && (
          <Section>
            <SectionHeader>Amount Paid</SectionHeader>
            {error && <ErrorText>{error}</ErrorText>}
            {loading ? (
              <LoadingText>Loading reports...</LoadingText>
            ) : (
              <StyledTable>
                <thead>
                  <StyledTableRow>
                    <StyledTableHeaderCell>Vehicle Number</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Vehicle Type</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Amount Paid</StyledTableHeaderCell>
                  </StyledTableRow>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <StyledTableRow key={req.id}>
                      <StyledTableCell>{req.vehicleNumber}</StyledTableCell>
                      <StyledTableCell>{req.vehicleType}</StyledTableCell>
                      <StyledTableCell>{req.tollAmount}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </tbody>
              </StyledTable>
            )}
          </Section>
        )}

        {activeSection === 'passHistory' && (
          <Section>
            <SectionHeader>Pass History</SectionHeader>
            {error && <ErrorText>{error}</ErrorText>}
            {loading ? (
              <LoadingText>Loading pass history...</LoadingText>
            ) : (
              <StyledTable>
                <thead>
                  <StyledTableRow>
                    <StyledTableHeaderCell>Driver Name</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Vehicle Number</StyledTableHeaderCell>
                    <StyledTableHeaderCell>From</StyledTableHeaderCell>
                    <StyledTableHeaderCell>To</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Date</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Status</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Vehicle Type</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Toll Amount</StyledTableHeaderCell>
                  </StyledTableRow>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <StyledTableRow key={req.id}>
                      <StyledTableCell>{req.driverName}</StyledTableCell>
                      <StyledTableCell>{req.vehicleNumber}</StyledTableCell>
                      <StyledTableCell>{req.from}</StyledTableCell>
                      <StyledTableCell>{req.to}</StyledTableCell>
                      <StyledTableCell>{req.date}</StyledTableCell>
                      <StyledTableCell>{req.status}</StyledTableCell>
                      <StyledTableCell>{req.vehicleType}</StyledTableCell>
                      <StyledTableCell>{req.tollAmount}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </tbody>
              </StyledTable>
            )}
          </Section>
        )}

        {activeSection === 'add' && (
          <Section>
            <SectionHeader>Book Toll Pass for Users</SectionHeader>
              <form onSubmit={handleSubmit}>
                <StyledInput
                  type="text"
                  placeholder="Driver Name"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  required
                />
                <FieldGroup>
                  <SmallInput
                    type="text"
                    placeholder="State Code"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    required
                    maxLength="2"
                  />
                  <SmallInput
                    type="text"
                    placeholder="District Code"
                    value={districtCode}
                    onChange={(e) => setDistrictCode(e.target.value)}
                    required
                    maxLength="2"
                  />
                  <SmallInput
                    type="text"
                    placeholder="Series"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    required
                    maxLength="1"
                  />
                  <SmallInput
                    type="text"
                    placeholder="Unique No."
                    value={uniqueNumber}
                    onChange={(e) => setUniqueNumber(e.target.value)}
                    required
                    maxLength="4"
                  />
                </FieldGroup>
                <StyledSelect value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} required>
                  <option value="Bike">Bike</option>
                  <option value="Car">Car</option>
                  <option value="Bus">Bus</option>
                  <option value="Lorry">Lorry</option>
                </StyledSelect>
                <ReadOnlyInput type="text" value={`Toll: ${tollAmount}`} readOnly />
                <StyledInput
                  type="text"
                  placeholder="From"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
                <StyledInput
                  type="text"
                  placeholder="To"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
                <StyledInput
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <StyledSelect value={status} onChange={(e) => setStatus(e.target.value)} required>
                  <option value="Approved">Approved</option>
                  <option value="Declined">Declined</option>
                  <option value="Pending">Pending</option>
                </StyledSelect>
                <StyledButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Add Toll Pass'}
                </StyledButton>
              </form>
          </Section>
        )}

        {activeSection === 'pending' && (
          <Section>
            <SectionHeader>Pending Requests</SectionHeader>
            {error && <ErrorText>{error}</ErrorText>}
            {loading ? (
              <LoadingText>Loading requests...</LoadingText>
            ) : (
              <StyledTable>
                <thead>
                  <StyledTableRow>
                    <StyledTableHeaderCell>Vehicle Number</StyledTableHeaderCell>
                    <StyledTableHeaderCell>From</StyledTableHeaderCell>
                    <StyledTableHeaderCell>To</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Date</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Status</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
                  </StyledTableRow>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <StyledTableRow key={request.id}>
                      <StyledTableCell>{request.vehicleNumber}</StyledTableCell>
                      <StyledTableCell>{request.from}</StyledTableCell>
                      <StyledTableCell>{request.to}</StyledTableCell>
                      <StyledTableCell>{request.date}</StyledTableCell>
                      <StyledTableCell>{request.status}</StyledTableCell>
                      <StyledTableCell>
                        <ActionButton onClick={() => handleApprove(request.id)} variant="approve">
                          Approve
                        </ActionButton>
                        <ActionButton onClick={() => handleDecline(request.id)} variant="decline">
                          Decline
                        </ActionButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </tbody>
              </StyledTable>
            )}
          </Section>
        )}

        {activeSection === 'approved' && (
          <Section>
            <SectionHeader>Approved Requests</SectionHeader>
            {error && <ErrorText>{error}</ErrorText>}
            {loading ? (
              <LoadingText>Loading requests...</LoadingText>
            ) : (
              <StyledTable>
                <thead>
                  <StyledTableRow>
                    <StyledTableHeaderCell>Vehicle Number</StyledTableHeaderCell>
                    <StyledTableHeaderCell>From</StyledTableHeaderCell>
                    <StyledTableHeaderCell>To</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Date</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Status</StyledTableHeaderCell>
                  </StyledTableRow>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <StyledTableRow key={request.id}>
                      <StyledTableCell>{request.vehicleNumber}</StyledTableCell>
                      <StyledTableCell>{request.from}</StyledTableCell>
                      <StyledTableCell>{request.to}</StyledTableCell>
                      <StyledTableCell>{request.date}</StyledTableCell>
                      <StyledTableCell>{request.status}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </tbody>
              </StyledTable>
            )}
          </Section>
        )}

        {activeSection === 'declined' && (
          <Section>
            <SectionHeader>Declined Requests</SectionHeader>
            {error && <ErrorText>{error}</ErrorText>}
            {loading ? (
              <LoadingText>Loading requests...</LoadingText>
            ) : (
              <StyledTable>
                <thead>
                  <StyledTableRow>
                    <StyledTableHeaderCell>Vehicle Number</StyledTableHeaderCell>
                    <StyledTableHeaderCell>From</StyledTableHeaderCell>
                    <StyledTableHeaderCell>To</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Date</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Status</StyledTableHeaderCell>
                  </StyledTableRow>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <StyledTableRow key={request.id}>
                      <StyledTableCell>{request.vehicleNumber}</StyledTableCell>
                      <StyledTableCell>{request.from}</StyledTableCell>
                      <StyledTableCell>{request.to}</StyledTableCell>
                      <StyledTableCell>{request.date}</StyledTableCell>
                      <StyledTableCell>{request.status}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </tbody>
              </StyledTable>
            )}
          </Section>
        )}

        {activeSection === 'date' && (
          <Section>
            <SectionHeader>Date of Pass</SectionHeader>
            {error && <ErrorText>{error}</ErrorText>}
            {loading ? (
              <LoadingText>Loading requests...</LoadingText>
            ) : (
              <StyledTable>
                <thead>
                  <StyledTableRow>
                    <StyledTableHeaderCell>Vehicle Number</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Date</StyledTableHeaderCell>
                  </StyledTableRow>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <StyledTableRow key={request.id}>
                      <StyledTableCell>{request.vehicleNumber}</StyledTableCell>
                      <StyledTableCell>{request.date}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </tbody>
              </StyledTable>
            )}
          </Section>
        )}

        {activeSection === 'toll' && (
          <Section>
            <SectionHeader>Toll for Vehicle</SectionHeader>
            {error && <ErrorText>{error}</ErrorText>}
            {loading ? (
              <LoadingText>Loading requests...</LoadingText>
            ) : (
              <StyledTable>
                <thead>
                  <StyledTableRow>
                    <StyledTableHeaderCell>Vehicle Number</StyledTableHeaderCell>
                    <StyledTableHeaderCell>From</StyledTableHeaderCell>
                    <StyledTableHeaderCell>To</StyledTableHeaderCell>
                  </StyledTableRow>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <StyledTableRow key={request.id}>
                      <StyledTableCell>{request.vehicleNumber}</StyledTableCell>
                      <StyledTableCell>{request.from}</StyledTableCell>
                      <StyledTableCell>{request.to}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </tbody>
              </StyledTable>
            )}
          </Section>
        )}
      </MainContent>
    </Container>
  );
};

export default AdminDashboard;

/* Styled Components */

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
`;

const Sidebar = styled.div`
  width: 200px;
  background-color: #2c3e50;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const IconWrapper = styled.span`
  margin-right: 8px;
  font-size: 18px;
`;

const SidebarItem = styled.div`
  margin-bottom: 20px;
  color: ${(props) => (props.active ? '#ecf0f1' : '#bdc3c7')};
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? '#34495e' : 'transparent')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  transition: all 0.3s ease;
  
  &:hover {
    color: #ecf0f1;
    background-color: ${(props) => (props.active ? '#34495e' : '#3b5360')};
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ecf0f1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  max-width: 900px;
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  flex: 1;
  margin-right: 10px;
`;

const RefreshButton = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #2980b9;
  }
`;

const Section = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 20px auto 40px auto;
  background: linear-gradient(135deg, #ffffff, #f7f7f7);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
  }
`;

const SectionHeader = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  color: #000;
`;

const FormContainer = styled.div`
  max-width: 600px;
  width: 100%;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: auto;
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 90%;
  padding: 15px 20px;
  margin: 12px 0;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  color: #333;
  background-color: #f9f9f9;
  transition: 0.3s ease;
  &:focus {
    border-color: #4caf50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.6);
    background-color: #ffffff;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 15px 20px;
  margin: 12px 0;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  color: #333;
  background-color: #f9f9f9;
  transition: 0.3s ease;
  &:focus {
    border-color: #4caf50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.6);
    background-color: #ffffff;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #45a049;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const StyledTableHeaderCell = styled.th`
  border: 1px solid #ddd;
  padding: 12px;
  background-color: #f4f4f4;
  text-align: left;
  color: black;
`;

const StyledTableCell = styled.td`
  border: 1px solid #ddd;
  padding: 12px;
  color: black;
`;

const StyledTableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const ErrorText = styled.p`
  color: red;
  text-align: center;
`;

const LoadingText = styled.p`
  padding: 20px;
  text-align: center;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  margin: 5px 4px 5px 0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  border: none;
  color: #fff;
  background-color: ${(props) =>
    props.variant === 'approve' ? '#4caf50' : '#f44336'};
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px auto 0 auto;
`;

const SummaryRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const SummaryCell = styled.td`
  padding: 12px;
  color: black;
  font-weight: bold;
`;

const DashboardImage = styled.img`
  display: block;
  margin: 20px auto 0 auto;
  max-width: 100%;
  height: auto;
`;

/* New styled components for the extra fields in Add Pass */
const FieldGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  gap: 10px;
`;

const SmallInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: white;
  text-transform: uppercase;
  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const ReadOnlyInput = styled.input`
  width: 90%;
  padding: 10px 15px;
  margin: 12px 0;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  background-color: #f1f1f1;
  color: #333;
  &:focus {
    outline: none;
  }
`;

const ExtraHeader = styled.h4`
  font-size: 20px;
  font-weight: 500;
  margin: 20px 0 10px;
  text-align: center;
  color: #333;
`;
