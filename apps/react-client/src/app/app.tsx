import { useEffect, useState, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Ticket, User } from '@acme/shared-models';

import styles from './app.module.css';
import Tickets from './tickets/tickets';
import { TicketDetails } from './ticket-details/ticket-details.component';

export const UserContext = createContext([] as User[]);

const App = () => {
  const [tickets, setTickets] = useState({
    allTickets: [] as Ticket[],
    filteredTickets: [] as Ticket[]
  });
  const [users, setUsers] = useState([] as User[]);

  // Very basic way to synchronize state with server.
  // Feel free to use any state/fetch library you want (e.g. react-query, xstate, redux, etc.).
  useEffect(() => {
    async function fetchTickets() {
      const data = await fetch('/api/tickets').then();
      const result = await data.json();
      setTickets({
        allTickets: result,
        filteredTickets: result
      });
    }

    async function fetchUsers() {
      const data = await fetch('/api/users').then();
      setUsers(await data.json());
    }

    fetchTickets();
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={users} >
      <div className={styles['app']}>
        <h1>Ticketing App</h1>
        {/* AddTicketCard */}
        {/* FilterTicket */}
        <Routes>
          <Route path="/" element={<Tickets tickets={tickets} setTickets={setTickets} />} />
          {/* Hint: Try `npx nx g component TicketDetails --no-export` to generate this component  */}
          <Route path="/:id" element={<TicketDetails  />} />
          {/* <Route path="/:id" element={<h2>Details Not Implemented</h2>} /> */}
        </Routes>
      </div>
    </UserContext.Provider>
  );
};

export default App;
