import { useEffect, useState } from "react";
import AdminNavBar from "../../components/AdminNavBar";
import "../../styles/moderateAdoptions.css";

export default function ModerateAdoptions() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_BE_URL;

  useEffect(() => {

    const fetchAdoptions = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${apiUrl}/api/adoptions/admin/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setRequests(data);

      } catch (error) {
        console.error("Error fetching adoption history:", error);
      }

      setLoading(false);
    };

    fetchAdoptions();

  }, []);

  return (
    <>
      <AdminNavBar />

      <div className="moderate-adoptions-container">

        <h1>Moderate Pet Adoptions</h1>

        <p className="page-info">
          Review adoption activity. View user accounts and flag users to notify the organization if needed.
        </p>

        {loading ? (

          <p>Loading adoption history...</p>

        ) : requests.length === 0 ? (

          <p>No finalized adoption requests found.</p>

        ) : (

          <table className="adoptions-table">

            <thead>
              <tr>
                <th>Pet Name</th>
                <th>User</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {requests.map((request) => (

                <tr key={request._id}>

                  <td>{request.animal?.name}</td>

                  <td>{request.user?.name}</td>

                  <td>{request.user?.email}</td>

                  <td>{request.organization?.name}</td>

                  <td className={request.status}>
                    {request.status}
                  </td>
                <td>
  {new Date(request.createdAt).toLocaleDateString()}
</td>
                 

                  

                </tr>

              ))}

            </tbody>

          </table>

        )}

        

      </div>
    </>
  );
}

