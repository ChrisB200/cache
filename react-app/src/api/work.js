import httpClient from '../utils/httpClient';
import { BASE_API_URL } from '../utils/constants';

export const fetchPayslipByMonth = async (month, year) => {
  try {
    const response = await httpClient.get(
      `${BASE_API_URL}/payslips/${month}/${year}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching payslip by month:', error);
    throw new Error('Failed to fetch payslip for the specified month and year.'); // Throw a formatted error
  }
};

export const fetchAllPayslips = async () => {
  try {
    const response = await httpClient.get(`${BASE_API_URL}/payslips`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all payslips:', error);
    throw new Error('Failed to fetch all payslips.');
  }
};

export const fetchAllShifts = async () => {
  try {
    const response = await httpClient.get(`${BASE_API_URL}/shifts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all shifts:', error);
    throw new Error('Failed to fetch all shifts.');
  }
};

export const fetchPayslipShifts = async (payslip_id) => {
  try {
    const response = await httpClient.get(`${BASE_API_URL}/payslips/${payslip_id}/shifts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shifts for payslip");
    throw new Error("Failed to fetch all shifts for payslip")
  }
}

export const fetchForecastedPayslip = async () => {
  try {
    const response = await httpClient.get(`${BASE_API_URL}/payslips/forecast`);
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error(error);
  }
}

export const editShift = async (shift_id, data) => {
  try {
    const response = await httpClient.put(`${BASE_API_URL}/shifts/${shift_id}`, data);
    return response.data
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
