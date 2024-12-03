import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, List, ListItem, ListItemText, Typography, } from '@mui/material';
import { Link } from 'react-router-dom';
import TitleBar from '@/components/titleBar/TitleBar';
import { useSelector } from 'react-redux';
import { API_URL } from '@/constants';
import axios from '../utils/redux/axiosConfig';
import { getSubjectFromToken } from '@/utils/redux/tokenUtils';
import { getCenterID } from '@/utils/user/center/getCenterID';
import { getEmployees } from '@/utils/user/employee/getEmployees';
import { deleteEmployee } from '@/utils/user/employee/deleteEmployee';

const ManageAccounts = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        const loadData = async () => {
            if (token) {
                const id = await getCenterID(token);
                if (id) {
                    const employees = await getEmployees(token, id);
                    setEmployees(employees);
                    setIsLoading(false);
                }
            }
        };

        loadData();
    }, [token]);

    const handleDelete = async (employeeId) => {
        try {
            await deleteEmployee(token, employeeId);
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
                                onClick={() => handleDelete(employee.id)}
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
