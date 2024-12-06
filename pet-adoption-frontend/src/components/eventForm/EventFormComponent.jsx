import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { DeleteEvent } from "@/utils/event/DeleteEvent";
import { SaveUpdateEvent } from "@/utils/event/SaveUpdateEvent";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EventFormComponent = (props) => {
    const token = useSelector((state) => state.user.token);
    const [formData, setFormData] = useState({
        event_id: null,
        center_id: null,
        event_name: '',
        event_date: new Date(),
        event_time: new Date(),
        event_description: '',
    });
    const [formType, setFormType] = useState('');
    const [buttonText, setButtonText] = useState('');

    useEffect(() => {
        setFormType(props.type);
        setButtonText(props.type === "update" ? "Update Event" : "Save Event");

        if (props.event?.event_id) {
            setFields(props.event);
        } else {
            resetFields();
        }
    }, [props.type, props.event]);

    const setFields = (event) => {
        const parseDateTime = (dateTimeString) => {
            const [datePart, timePart] = dateTimeString.split(' ');
            const [day, month, year] = datePart.split('/').map(Number);
            const [hours, minutes] = timePart.split(':').map(Number);
            return new Date(year, month - 1, day, hours, minutes);
        }
        const receivedDateTime = parseDateTime(event.event_date + " " + event.event_time);

        setFormData({
            event_id: event.event_id,
            center_id: event.center_id,
            event_name: event.event_name,
            event_date: receivedDateTime,
            event_time: receivedDateTime,
            event_description: event.event_description,
        });
    };

    const resetFields = () => {
        setFormData({
            event_id: null,
            center_id: null,
            event_name: '',
            event_date: new Date(),
            event_time: new Date(),
            event_description: '',
        });
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        const eventData = {
            ...formData,
            event_date: formatDate(formData.event_date),
            event_time: formatTime(formData.event_time),
        };
        await DeleteEvent({
            event: eventData,
            token,
            resetFields,
            handleCreateNewEvent: props.handleCreateNewEvent
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const eventData = {
            ...formData,
            event_date: formatDate(formData.event_date),
            event_time: formatTime(formData.event_time),
        };
        try {
            await SaveUpdateEvent({
                formType,
                event: eventData,
                token,
                resetFields,
                handleCreateNewEvent: props.handleCreateNewEvent
            });
        } catch (error) {
            console.error("Error saving/updating event:", error);
            alert("An error occurred while saving or updating the event. Please try again.");
        }
    };

    const handleValidateSetEvent = () => {
        return formData.event_name &&
            formData.event_date &&
            formData.event_time &&
            formData.event_description;
    };

    const customInputStyle = {
        backgroundColor: 'background.paper',
        '& .MuiOutlinedInput-root': {
            height: '40px'
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                height: '92vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: 'background.default'
            }}
        >
            {/* Header */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 1.5,
                px: 2,
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                minHeight: '56px',
                flexShrink: 0,
            }}>
                <Button
                    onClick={props.handleCreateNewEvent}
                    variant='outlined'
                    startIcon={<ArrowBackIcon />}
                    size="small"
                >
                    Back to Events
                </Button>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                    {formType === "update" ? "Edit Event Details" : "Add New Event"}
                </Typography>
            </Box>

            {/* Form Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                <Box sx={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    p: 3,
                    boxShadow: 1
                }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                                Event Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Event Name *"
                                value={formData.event_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, event_name: e.target.value }))}
                                required
                                fullWidth
                                size="small"
                                sx={customInputStyle}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                                Date & Time
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        selected={formData.event_date}
                                        onChange={(date) => setFormData(prev => ({ ...prev, event_date: date }))}
                                        dateFormat="MMMM d, yyyy"
                                        customInput={
                                            <TextField
                                                label="Event Date *"
                                                required
                                                fullWidth
                                                size="small"
                                                sx={customInputStyle}
                                            />
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        selected={formData.event_time}
                                        onChange={(date) => setFormData(prev => ({ ...prev, event_time: date }))}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                        customInput={
                                            <TextField
                                                label="Event Time *"
                                                required
                                                fullWidth
                                                size="small"
                                                sx={customInputStyle}
                                            />
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                                Event Details
                            </Typography>
                            <TextField
                                label="Description *"
                                value={formData.event_description}
                                onChange={(e) => setFormData(prev => ({ ...prev, event_description: e.target.value }))}
                                fullWidth
                                multiline
                                rows={4}
                                required
                                size="small"
                                placeholder="Enter event description..."
                                sx={{
                                    backgroundColor: 'background.paper',
                                    '& .MuiOutlinedInput-root': {
                                        padding: '12px'
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* Footer */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                py: 1.5,
                px: 2,
                borderTop: 1,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                minHeight: '56px',
                flexShrink: 0,
            }}>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={!handleValidateSetEvent()}
                >
                    {buttonText}
                </Button>
                {formType === "update" && (
                    <Button
                        onClick={handleDelete}
                        variant="outlined"
                        color="error"
                        fullWidth
                        size="large"
                    >
                        Delete Event
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default EventFormComponent;