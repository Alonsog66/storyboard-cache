import React, { useState, useEffect } from "react";
import Event from './Event.jsx';

export default function EventsFeed (props) {
	let events = [];
	//creates events for each event in feed
	if (props.events && Object.keys(props.events).length > 0) {
		events = props.events.map((event, index) => {
			return <Event
				{...event}
				userUpdate={props.userUpdate}
				key={`EventsFeed${index}`}
			/>
		})
	}
	return (
		<div className="events">
			{events}
		</div>
	);
}

//handleupdate or handlelete event which gets passed down as a prop, update event feed and send fetch request to the backend(delete this event), 