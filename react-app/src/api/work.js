import httpClient from '../utils/httpClient';
import { BASE_API_URL } from '../utils/constants';

export const fetchPayslipByMonth = async (month, year) => {
  try {
    const response = await httpClient.get(
      `${BASE_API_URL}/work/get_payslip?month=${month}&year=${year}`
    );
    return response.data; // Return data if successful
  } catch (error) {
    console.error('Error fetching payslip by month:', error);
    throw new Error('Failed to fetch payslip for the specified month and year.'); // Throw a formatted error
  }
};

export const fetchAllPayslips = async () => {
  try {
    const response = await httpClient.get(`${BASE_API_URL}/work/all_payslips`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all payslips:', error);
    throw new Error('Failed to fetch all payslips.');
  }
};

export const fetchAllShifts = async () => {
  try {
    const response = await httpClient.get(`${BASE_API_URL}/work/all_shifts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all shifts:', error);
    throw new Error('Failed to fetch all shifts.');
  }
};

export const fetchPayslipShifts = async (payslip_id) => {
  try {
    const response = await httpClient.get(`${BASE_API_URL}/work/payslip_shifts?payslip_id=${payslip_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shifts for payslip");
    throw new Error("Failed to fetch all shifts for payslip")
  }
}

export const fetchForecastedShifts = async () => {
  try {
    const response = await httpClient.get(`${BASE_API_URL}/work/recent_payslip`);
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error(error);
  }
}
