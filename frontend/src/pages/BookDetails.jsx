import { useParams } from "react-router-dom";
import { useEffect } from "react";

const BookDetails = () => {
  const { id } = useParams();

  useEffect(() => {
    console.log("Book ID from route:", id);
  }, [id]);

  return (
    <div className="p-4">
      <h2 className="text-xl">Book Details Page</h2>
      <p>Book ID: {id}</p>
    </div>
  );
};

export default BookDetails;
