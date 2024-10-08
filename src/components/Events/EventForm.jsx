import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { fetchImages } from "../../util/http.js";
import ImagePicker from "../ImagePicker.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventForm({ inputData, onSubmit, children }) {
  const {
    data: fetchedImages,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["images"],
    queryFn: fetchImages,
  });
  const [selectedImage, setSelectedImage] = useState(inputData?.image);

  function handleSelectImage(image) {
    setSelectedImage(image);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    onSubmit({ ...data, image: selectedImage });
  }

  return (
    <form id="event-form" onSubmit={handleSubmit} method="dialog">
      <p className="control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={inputData?.title ?? ""}
        />
      </p>

      {isPending && <p>Loading images...</p>}
      {isError && (
        <ErrorBlock title="An error occurred" message={error.info?.message} />
      )}
      <div className="control">
        <ImagePicker
          images={fetchedImages || []}
          onSelect={handleSelectImage}
          selectedImage={selectedImage}
        />
      </div>

      <p className="control">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={inputData?.description ?? ""}
        />
      </p>

      <div className="controls-row">
        <p className="control">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={inputData?.date ?? ""}
          />
        </p>

        <p className="control">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            defaultValue={inputData?.time ?? ""}
          />
        </p>
      </div>

      <p className="control">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          defaultValue={inputData?.location ?? ""}
        />
      </p>

      <p className="form-actions">{children}</p>
    </form>
  );
}
