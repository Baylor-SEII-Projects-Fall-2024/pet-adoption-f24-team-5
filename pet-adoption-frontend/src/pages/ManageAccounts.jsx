import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, List, ListItem, ListItemText, Typography, } from '@mui/material';
import { Link } from 'react-router-dom';
import TitleBar from '@/components/TitleBar';
import { useSelector } from 'react-redux';
import { API_URL } from '@/constants';
import axios from '../utils/axiosConfig';
import { getSubjectFromToken } from '@/utils/tokenUtils';

const ManageAccounts = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [centerID, setCenterID] = useState(null);

    const token = useSelector((state) => state.user.token);


    const getCenterID = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/adoption-center/getCenterID/${getSubjectFromToken(token)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setCenterID(response.data);
            return response.data;
        } catch (err) {
            console.error('Failed to fetch center ID:', err);
            setError('Failed to fetch center ID');
            setIsLoading(false);
        }
    };


    const fetchEmployees = async (id) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/adoption-center/getEmployees/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setEmployees(response.data);
        } catch (err) {
            console.error('Failed to fetch employees:', err);
            setError('Failed to fetch employees');
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        const loadData = async () => {
            if (token) {
                const id = await getCenterID();
                if (id) {
                    await fetchEmployees(id);
                }
            }
        };

        loadData();
    }, [token]);

    const deleteEmployee = async (employeeId) => {
        try {
            await axios.delete(
                `${API_URL}/api/adoption-center/deleteEmployee/${employeeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setEmployees((prevEmployees) =>
                prevEmployees.filter((employee) => employee.id !== employeeId)
            );
        } catch (err) {
            console.error('Failed to delete employee:', err);
            setError('Failed to delete employee');
        }
    };

    return (
        <Box>
            <Button
                color="inherit"
                component={Link}
                to="/RegisterCenterWorker"
                sx={{ width: 'auto', alignSelf: 'center', mt: 2, border: '1px solid #000000', borderRadius: '8px', }}

            >
                Create Center Worker Account
            </Button>

            {isLoading ? (
                <CircularProgress sx={{ mt: 4 }} />
            ) : error ? (
                <Typography color="error" sx={{ mt: 4 }}>
                    {error}
                </Typography>
            ) : (
                <List sx={{ width: '100%', maxWidth: 600, mt: 4 }}>
                    {employees.map((employee) => (
                        <ListItem key={employee.id}>
                            <ListItemText
                                primary={`${employee.firstName} ${employee.lastName}`}
                                secondary={`Email: ${employee.emailAddress} | Phone: ${employee.phoneNumber}`}
                            />
                            <Button
                                color="secondary"
                                onClick={() => deleteEmployee(employee.id)}
                                sx={{ ml: 2 }}
                            >
                                Delete
                            </Button>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default ManageAccounts;
