import AdminNavBar from "../../components/AdminNavBar";
import "../../styles/ModerateAdoptions.css";

export default function ModerateAdoptions() {
  return (
    <>
      <AdminNavBar />

      <div className="moderate-adoptions-container">
        <h1>Moderate Pet Adoptions</h1>

        <p className="page-info">
          Review adoption activity. View user accounts and flag users to notify the organization if needed.
        </p>

        <table className="adoptions-table">
          <thead>
            <tr>
              <th>Pet Name</th>
              <th>User</th>
              <th>Email</th>
              <th>Organization</th>
              <th>Status</th>
              <th>User Account</th>
              <th>Flag</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Luna</td>
              <td>Maria Silva</td>
              <td>maria@email.com</td>
              <td>Happy Paws Rescue</td>
              <td className="pending">Pending</td>
              <td>
                <button className="view-btn">
                  View Account
                </button>
              </td>
              <td>
                <button className="flag-btn" title="Flag user">
                  🚩
                </button>
              </td>
            </tr>

            <tr>
              <td>Max</td>
              <td>John Doe</td>
              <td>john@email.com</td>
              <td>Safe Tails Shelter</td>
              <td className="approved">Adopted</td>
              <td>
                <button className="view-btn">
                  View Account
                </button>
              </td>
              <td>
                <button className="flag-btn" title="Flag user">
                  🚩
                </button>
              </td>
            </tr>

            <tr>
              <td>Bella</td>
              <td>Ana Costa</td>
              <td>ana@email.com</td>
              <td>Pet Care Center</td>
              <td className="pending">Pending</td>
              <td>
                <button className="view-btn">
                  View Account
                </button>
              </td>
              <td>
                <button className="flag-btn" title="Flag user">
                  🚩
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="legend">
          <p>
            <span className="flag-icon">🚩</span>
            Clicking the flag notifies the organization about a potentially suspicious user.
          </p>
        </div>
      </div>
    </>
  );
}