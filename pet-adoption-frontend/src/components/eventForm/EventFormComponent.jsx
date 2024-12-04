import { Box, Button, Stack, TextField } from "@mui/material";
import DatePicker from "react-datepicker";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { DeleteEvent } from "@/utils/event/DeleteEvent";
import { SaveUpdateEvent } from "@/utils/event/SaveUpdateEvent";

const EventFormComponent = (props) => {
    const [event_id, setEventID] = useState(null);
    const [center_id, setCenterID] = useState(null);
    const [event_name, setEventName] = useState('');
    const [event_date, setEventDate] = useState(new Date());
    const [event_time, setEventTime] = useState(new Date());
    const [event_description, setEventDescription] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [formType, setFormType] = useState('');
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        setFormType(props.type);
        setButtonText(props.type === "update" ? "Update Event" : "Save Event");

        if (props.event && props.event.event_id) {
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

        setEventID(event.event_id);
        setCenterID(event.center_id);
        setEventName(event.event_name);
        setEventDate(receivedDateTime);
        setEventTime(receivedDateTime);
        setEventDescription(event.event_description);
    };

    const resetFields = () => {
        setEventID(null);
        setCenterID(null);
        setEventName('');
        setEventDate(null);
        setEventTime(null);
        setEventDescription('');
    };
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes}`
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        const eventData = {
            event_id,
            center_id,
            event_name,
            event_date: formatDate(event_date),
            event_time: formatTime(event_time),
            event_description
        };
        await DeleteEvent({
            event: eventData,
            token,
            resetFields,
            handleCreateNewEvent: props.handleCreateNewEvent
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSaveOrUpdateEvent();
    };

    const handleSaveOrUpdateEvent = async () => {
        const eventData = {
            event_id,
            center_id,
            event_name,
            event_date: formatDate(event_date),
            event_time: formatTime(event_time),
            event_description
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

    const handleDateChange = (date) => {
        setEventDate(date);
        setEventTime(date);
    };

    const handleValidateSetEvent = (displayAlert) => {
        if (event_name && event_date && event_time && event_description) {
            return true;
        }
        if (displayAlert) {
            if (!event_name) alert("Please enter an event name");
            else if (!event_date) alert("Please enter an event date");
            else if (!event_time) alert("Please enter an event time");
            else if (!event_description) alert("Please enter an event description");
            else alert("Unknown error when validating event");
        }
        return false;
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Button onClick={props.handleCreateNewEvent} variant='contained'>Back to Events</Button>
            <Stack spacing={2} sx={{ marginTop: 2 }}>
                <TextField
                    label="Event Name"
                    value={event_name}
                    onChange={(e) => setEventName(e.target.value)}
                    fullWidth
                />
                <DatePicker
                    selected={event_date}
                    onChange={handleDateChange}
                    showTimeSelect
                    dateFormat="Pp"
                    customInput={<TextField label="Event Date" fullWidth />}
                />
                <TextField
                    label="Description"
                    value={event_description}
                    onChange={(e) => setEventDescription(e.target.value)}
                    fullWidth
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!handleValidateSetEvent(false)}
                >
                    {buttonText}
                </Button>
                {formType === "update" && (
                    <Button
                        type="button"
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                    >
                        Delete Event
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default EventFormComponent;