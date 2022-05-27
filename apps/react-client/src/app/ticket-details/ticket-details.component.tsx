import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { UserContext } from '../app'

export const TicketDetails = () => {
  const navigate = useNavigate();
  const location: any = useLocation();
  const state = location.state?.ticket

  const { id, assigneeId, description, completed } = state;
  const userContext = useContext(UserContext);

  let userName = ''

  for (let user of userContext) {
    if (user.id === assigneeId) {
      userName = user.name;
      break
    } else {
      userName = 'Ticket not assigned'
    }
  }
  
    return (
        <div>
          <h3>{`Ticket ${id}`}</h3>
          <p>{`Assigned to: ${userName}`}</p>
          <p>{`Description: ${description}`}</p>
          <p>{`Ticketed completion: ${completed}`}</p>
          <button onClick={() => navigate(-1)}>Back to Home</button>
        </div>
    )
}