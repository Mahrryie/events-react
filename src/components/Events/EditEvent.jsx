import { Link, useNavigate, useParams } from "react-router-dom";

import { useMutation, useQuery } from "@tanstack/react-query";
import { editEvent, fetchEvent, queryClient } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";

export default function EditEvent() {
  const params = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: () => fetchEvent({ eventId: params.id }),
  });

  const {
    mutate,
    isPending: isEditPending,
    isError: isEditError,
    error: editError,
  } = useMutation({
    mutationFn: editEvent,
    onMutate: async (data) => {
      const newEvent = data.updatedEvent;
      await queryClient.cancelQueries({ queryKey: ["events", params.id] });
      const prevData = queryClient.getQueryData(["events", params.id]);
      queryClient.setQueryData(["events", params.id], newEvent);

      return { prevData };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["events", params.id], context.prevData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events", params.id] });
    },
  });

  function handleClose() {
    navigate("../");
  }

  function handleSubmit(formData) {
    mutate({ eventId: params.id, updatedEvent: formData });
    handleClose();
  }

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            "Please, try again later or check your inputs"
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          {isEditPending ? "Updating..." : "Update"}
        </button>
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}
