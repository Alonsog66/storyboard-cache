import React, { useState, useEffect } from 'react';
import Profile from './Profile.jsx';
import EventsFeed from './EventsFeed.jsx';
import Notnav from './Navbar.jsx';
import axios from 'axios';
import { Card, Button, Col, Row, Container } from 'react-bootstrap';
import AddSearchEvent from './AddSearchEvent.jsx';

// Implemented with hooks throughout
export default function MainContainer() {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);

  //pull user data after OAuth login - all variables are named from SQL DB columns
  useEffect(() => {
    axios.get(`/api/info?userName=${userName}`).then((res) => {
      let userInfo = {
        username: res.data.users.username,
        firstname: res.data.users.firstname,
        lastname: res.data.users.lastname,
        profilephoto: res.data.users.profilephoto,
      };
      console.log(res);
      let eventsInfo = res.data.events;
      setUser(userInfo);
      setEvents(eventsInfo);
      setUserName(res.data.users.username);
    });
  }, []);
  //updates username when a different user is selected
  function handleUserPageChange(username) {
    setUserName(username);
  }
  //handles the state change and posts to database on event creation
  function handleCreateOrModifyEvent(event, newEvent, eventIndex) {
    console.log(event);
    let {
      eventtitle,
      eventlocation,
      eventdate,
      eventstarttime,
      eventdetails,
    } = event;
    if (!newEvent) {
      axios
        .put(`/api/events/${events[eventIndex].eventid}`, {
          eventtitle,
          eventlocation,
          eventdate,
          eventstarttime,
          eventdetails,
        })
        .then((res) => {
          // Update events state variable
          const updatedEvents = events;
          updatedEvents[eventIndex] = {
            ...updatedEvents[eventIndex],
            ...event,
          };
          return setEvents([...updatedEvents]);
        });
    } else {
      axios
        .post(`/api/create?userName=${userName}`, {
          eventtitle,
          eventlocation,
          eventdate,
          eventstarttime,
          eventdetails,
        })
        .then((res) => {});
      event.attendees = [
        {
          username: user.username,
          profilephoto: user.profilephoto,
        },
      ];
      event.eventownerusername = userName;
      const newEvents = [event].concat(events);
      return setEvents(newEvents);
    }
  }

  //handles the state change and posts to database on search event add
  function handleSearchEvent(event) {
    // ADD
    axios.post(`/api/add?eventtitle=${event.eventtitle}`).then((res) => {
      event.attendees.push({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        profilephoto: user.profilephoto,
      });

      const newEvents = [event].concat(events);
      setEvents(newEvents);
    });
  }

  return (
    <div className='myContainer'>
      <Notnav />
      <div className='container'>
        <Container className='header'>
          <Profile {...user} />
          <AddSearchEvent
            addEvent={handleCreateOrModifyEvent}
            searchEvent={handleSearchEvent}
            events={events}
          />
        </Container>
        <EventsFeed
          addEvent={handleCreateOrModifyEvent}
          user={user}
          events={events}
          setEvents={setEvents}
          userUpdate={handleUserPageChange}
        />
      </div>
    </div>
  );
}
