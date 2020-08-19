import React, { useState, useEffect } from 'react';
import EventAttendees from './EventAttendees.jsx';
import Content from './Content.jsx';
import { ListGroup, Container, Row, Jumbotron, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import CreateEvent from './CreateEvent.jsx';
import axios from 'axios';

export default function Event(props) {
  let eventOwner = props.events[props.id].eventownerusername;
  let currentUser = props.user.username;

  return (
    <>
      <b className='hr anim'></b>
      <div className='event'>
        <Container>
          {eventOwner === currentUser && (
            <div className='event-owner-buttons'>
              <CreateEvent
                eventIndex={props.id}
                addEvent={props.addEvent}
                updatingEvent={'updatingEvent'}
                eventInfo={props}
              />

              <Button
                variant='danger'
                type='submit'
                onClick={(e) => {
                  const updatedEvents = props.events;
                  const removedEvent = updatedEvents.splice(props.id, 1);
                  props.setEvents([...updatedEvents]);
                  console.log(removedEvent);

                  // Send delete http request here!
                  const { eventid } = removedEvent[0];
                  console.log(eventid);
                  axios.delete(`/api/events/${eventid}`).then((res) => {});
                }}
              >
                X
              </Button>
            </div>
          )}
          <Jumbotron fluid>
            <Container className='eventJumbotron'>
              <h1>{props.eventtitle}</h1>
              <h4>
                {props.eventdate} - {props.starttime}
              </h4>
              <h4>
                Location <FontAwesomeIcon icon={faLocationArrow} size='1x' /> :
                {props.eventlocation}
              </h4>
              <p>{props.eventdetails}</p>
            </Container>
          </Jumbotron>

          <Container>
            <EventAttendees {...props} userUpdate={props.userUpdate} />
          </Container>
          <Content {...props} />
        </Container>
      </div>
    </>
  );
}
