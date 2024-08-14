import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";
import Header from "../Header.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import Modal from "../UI/Modal.jsx";

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: () => fetchEvent({ eventId: params.id }),
  });

  const {
    mutate,
    isPending: isDeletePending,
    isError: isErrorDelete,
    error: errorDelete,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "none",
      });
      setIsDeleting(false);
      navigate("/events");
    },
  });

  const handleStartDeleting = () => {
    setIsDeleting(true);
  };

  const handleStopDeleting = () => {
    setIsDeleting(false);
  };

  const handleDelete = () => {
    mutate({ eventId: params.id });
  };

  let content;

  if (isLoading) {
    content = (
      <div id="event-details-content" className="center">
        <p>Loading event data</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <div id="event-details-content" className="center">
        <ErrorBlock
          title="Error while fetching the event"
          message={
            error.info?.message || "Some error happened, try again later"
          }
        />
      </div>
    );
  }

  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    content = (
      <>
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              <button onClick={handleStartDeleting}>
                {isDeletePending ? "Deleting..." : "Delete"}
              </button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>
                  {formattedDate} at {data.time}
                </time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      </>
    );
  }
  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDeleting}>
          <h2>Are you sure?</h2>
          <p>Do you really want to delete this event?</p>
          <div className="form-actions">
            {isDeletePending && "Deleting, please wait"}
            <button className="button-text" onClick={handleStopDeleting}>
              Cancel
            </button>
            <button className="button-text" onClick={handleDelete}>
              Delete
            </button>
          </div>
          {isErrorDelete && (
            <ErrorBlock
              title="Failed to delete"
              message={
                errorDelete.info?.message ||
                "An error while deleting the event."
              }
            />
          )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {content}
    </>
  );
}
