import { QueryClient } from "@tanstack/react-query";

class CustomError extends Error {
  constructor(message, code, info) {
    super(message);
    this.code = code;
    this.info = info;
  }
}

export const queryClient = new QueryClient();

export async function fetchEvents({ searchTerm, max }) {
  let url = "http://localhost:3000/events";

  if (searchTerm && max) {
    url += `?search=${searchTerm}?max=${max}`;
  } else if (searchTerm) {
    url += `?search=${searchTerm}`;
  } else if (max) {
    url += `?max=${max}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    const info = await response.json();
    throw new CustomError(
      "An error occurred while fetching the events",
      response.status,
      info
    );
  }

  const { events } = await response.json();

  return events;
}

export async function createNewEvent({ newEvent }) {
  const response = await fetch("http://localhost:3000/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event: newEvent }),
  });

  if (!response.ok) {
    const info = await response.json();
    throw new CustomError(
      "An error occurred while creating an event",
      500,
      info
    );
  }

  const { event } = await response.json();
  return event;
}

export async function fetchImages() {
  const response = await fetch("http://localhost:3000/events/images");

  if (!response.ok) {
    const info = await response.json();
    throw new CustomError("An error while fetching images", 500, info);
  }

  const { images } = await response.json();
  return images;
}

export async function fetchEvent({ eventId }) {
  const response = await fetch(`http://localhost:3000/events/${eventId}`);

  if (!response.ok) {
    const info = await response.json();
    throw new CustomError(
      "An error occurred while fetching the event",
      500,
      info
    );
  }

  const { event } = await response.json();
  return event;
}

export async function deleteEvent({ eventId }) {
  const response = await fetch(`http://localhost:3000/events/${eventId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the event");
    error.code = 500;
    error.info = await error.json();
    throw error;
  }

  return response.json();
}

export async function editEvent({ eventId, updatedEvent }) {
  const response = await fetch(`http://localhost:3000/events/${eventId}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ event: updatedEvent }),
  });

  if (!response.ok) {
    const info = await response.json();
    throw new CustomError("Error while editing event", 500, info);
  }

  const { event } = await response.json();

  return event;
}
