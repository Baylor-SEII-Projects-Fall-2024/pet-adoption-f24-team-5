import {Box, Button, Stack, TextField} from "@mui/material";
import DatePicker from "react-datepicker";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import {DeleteEvent} from "@/utils/DeleteEvent";
import {SaveUpdateEvent} from "@/utils/SaveUpdateEvent";

const EventFormComponent = (props) => {
    const [event_id, setEventID] = useState(null);
    const [center_id , setCenterID] = useState(null);
    const [event_name, setEventName] = useState('');
    const [event_date, setEventDate] = useState(new Date());
    const [event_time, setEventTime] = useState(() => new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }));
    const [event_description, setEventDescription] = useState('');
    const [buttonText, setButtonText] = React.useState('');
    const [formType , setFormType] = React.useState('');
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        setFormType(props.type);
        if(props.type === "save") {
            setButtonText("Save Event");
        } else if(props.type === "update") {
            setButtonText("Update Event");
        }
        if(props.event && props.event.event_id) {
            setFields(props.event);
        } else {
            resetFields();
        }
    }, [props.type, props.event]);
    const setFields = (event) => {
        setEventID(event.event_id);
        setCenterID(event.center_id);
        setEventName(event.event_name);
        setEventDate(event.event_date);
        setEventTime(event.event_time);
        setEventDescription(event.event_description);
    };
    const resetFields= () => {
        setEventID("");
        setCenterID("");
        setEventName("");
        setEventDate(null);
        setEventTime(null);
        setEventDescription("");
    };
    const handleDelete = (event) => {
        event.preventDefault();

        const eventData = {
            event_id,
            center_id,
            event_name,
            event_date,
            event_time,
            event_description
        };
        DeleteEvent({
            eventData,
            token,
            resetFields,
            handleCreateEvent: props.handleCreateEvent
        });
    };
    const handleSubmit = (event) => {
        event.preventDefault();

        handleSaveOrUpdateEvent();
    };
    const handleSaveOrUpdateEvent = () => {
        const baseEventData = {
            event_id,
            center_id,
            event_name,
            event_date,
            event_time,
            event_description
        };
        const eventData = (formType === "update") ? {event_id,...baseEventData} : baseEventData;
        SaveUpdateEvent({
            formType, eventData, token, resetFields
        });
    }
    const handleDateChange = (date) => {
        if (!date) {
            console.error("No date provided.");
            return "Invalid time";
        }
        setEventDate(date);

        const dateObj = date instanceof Date && !isNaN(date)
            ? date
            : new Date(date);

        if (isNaN(dateObj.getTime())) {
            console.error("Invalid date:", date);
            return "Invalid time";
        }

        setEventTime(dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }));
    }
    const handleValidateSetEvent = (displayAlert) => {
        if(event_name && event_date && event_time && event_description) {
            return true;
        }
        if(displayAlert) {
            if(!event_name) {
                alert("Please enter an event name");
            }
            else if(!event_date) {
                alert("Please enter an event date");
            }
            else if(!event_time) {
                alert("Please enter an event time");
            }
            else if(!event_description) {
                alert("Please enter an event description");
            }
            else alert("Unknown error when validating event");
        }
        return false;
    }
    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Button onClick={props.handleCreateEvent} variant='contained'>Back to Events </Button>
            <Stack spacing={2} sx={{ marginTop: 2 }}>
                <TextField
                    label="Event Name"
                    value={event_name}
                    onChange={(e) => setEventName(e.target.value)}
                    fullWidth
                />
                <DatePicker
                    selected={event_date}
                    onChange={(date) => handleDateChange(date)}
                    fullWidth
                    showTimeSelect
                    dateFormat="Pp"
                    customInput={
                    <TextField
                        label="Event Date"
                        fullWidth
                    />}
                />
                <TextField
                    label="Description"
                    value={event_description}
                    onChange={(e) => setEventDescription(e.target.value)}
                    fullWidth
                />
                <Button
                    type="submit"
                    variant='contained'
                    disabled={!handleValidateSetEvent(false)}>
                    {buttonText}
                </Button>
                {(props.type === "update") &&
                    <Button
                        type="delete"
                        variant="contained"
                        onClick={handleDelete}>
                        Delete Event
                    </Button>
                }
            </Stack>
        </Box>
    )
}

export default EventFormComponent;
/*
            {!createEvent && (
                <Stack sx={{ paddingTop: 4, maxWidth: '1200px', margin: '0 auto' }} alignItems='center' gap={5}>
                    {getAuthorityFromToken(token) !== "Owner" && (
                        <Button onClick={handleCreateEvent} color='inherit' variant='contained'>
                            Create Event
                        </Button>
                    )}
                    {noFutureEvents ? (
                        <Typography variant="h6" color="error">No future events</Typography>
                    ) : (
                        <Stack spacing={2} direction='row' flexWrap='wrap' justifyContent='center'>
                            {events.map(event => (

                                <EventCard key={event.event_id} event={event} onClick = {() => handleCardClick(event)} />
                            ))}
                        </Stack>
                    )}
                </Stack>
            )}
        </Box>
    );*/
/*
const handleDateStringToDate = (dateString) => {
    console.log("Converting dateString to date...");
    const [day, month, year] = dateString.split('/');
    const newDate = new Date(year, month - 1, day);

    // Normalize the time to midnight for accurate date comparison
    newDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
    console.log("Original date: " + dateString + " | New date: " + newDate);

    return newDate;
};
const handleDateToTimeString = (selectedDate) => {
    console.log("Converting date to time string...");

    if (!selectedDate) {
        console.error("No date provided.");
        return "Invalid time";
    }

    const dateObj = selectedDate instanceof Date && !isNaN(selectedDate)
        ? selectedDate
        : new Date(selectedDate);

    if (isNaN(dateObj.getTime())) {
        console.error("Invalid date:", selectedDate);
        return "Invalid time";
    }

    return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};
const handleDateToString = (selectedDate) => {
    console.log("Converting date to string...");
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = selectedDate.getFullYear();
    console.log("Old date: " + selectedDate + " | New date: " + `${day}/${month}/${year}`);
    return `${day}/${month}/${year}`;
}

*/