import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import styled from 'styled-components';

const AdminAddTollPass = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Approved'); // default status

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'tollPassRequests'), {
        vehicleNumber,
        from,
        to,
        date,
        status,
      });
      alert('Toll Pass Added!');
    } catch (err) {
      console.error("Error adding document: ", err);
      alert('Failed to add toll pass. Try again.');
    }
  };

  return (
    <FormContainer>
     <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' ,color:'black'}}>Book Toll Pass for Users</h3>
      <Header></Header>
      <form onSubmit={handleSubmit}>
        <StyledInput
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          required
        />
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
        <StyledSelect
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="Approved">Approved</option>
          <option value="Declined">Declined</option>
          <option value="Pending">Pending</option>
        </StyledSelect>
        <StyledButton type="submit">Add Toll Pass</StyledButton>
      </form>
    </FormContainer>
  );
};

// Styled Components

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
    border-color: #4CAF50;
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
    border-color: #4CAF50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.6);
    background-color: #ffffff;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const Header = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  color: #000; /* Updated to black */
`;

export default AdminAddTollPass;
