export async function fetchEvents({ searchTerm }) {
  let url = "http://localhost:3000/events";

  if (searchTerm) {
    // console.log("search", search);
    url += "?search=" + searchTerm;
  }
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
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
    const error = new Error("An error occurred while creating an event");
    error.code = 500;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();
  return event;
}

export async function fetchImages() {
  const response = await fetch("http://localhost:3000/events/images");

  if (!response.ok) {
    const error = new Error("An error while fetching images");
    error.code = 500;
    error.info = await response.json();

    throw error;
  }

  const { images } = await response.json();
  return images;
}
