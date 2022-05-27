import { useState, useEffect } from 'react';

import { Ticket } from '@acme/shared-models';
import styles from './tickets.module.css';
import { UserSelection } from '../components/UserSelection';
import { AddTicketCard } from '../components/AddTicketCard';
import { Link } from 'react-router-dom';

export interface TicketsProps {
  tickets: {
    allTickets: Ticket[],
    filteredTickets: Ticket[]
  };
  setTickets: any;
}

export function Tickets(props: TicketsProps) {
  const [filterString, setFilterString] = useState('');
  const [updatedTicket, setUpdatedTicket] = useState({} as Ticket)
  const [counterComplete, setCounterComplete] = useState(0);


  const updateTicketDB = async (ticket: Ticket) => {
    const location = `http://localhost:4200/api/tickets/${ticket.id}/complete`
    const config = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket)
    };
    try {
        const fetchResponse = await fetch(location, config);
        const data = await fetchResponse.json();
        return data;
    } catch (e) {
        return e;
    }    

}

  const handleClickComplete = (i: number) => {
    setCounterComplete(counterComplete + 1)
    const copyState = props.tickets.filteredTickets.slice();
    copyState[i].completed = !copyState[i].completed;
    props.setTickets({
      ...props.tickets,
      filteredTickets: copyState
    })
    setUpdatedTicket(copyState[i]);
  }

  useEffect(() => {
    if (filterString === '') return;
    let copyState = { ...props.tickets }
    let filteredArr = copyState.allTickets;
    if (filterString === 'none') {

      props.setTickets({
        ...props.tickets,
        filteredTickets: filteredArr
      })
    } else if (filterString === 'completed') {
      props.setTickets({
        ...props.tickets,
        filteredTickets: filteredArr.filter(obj => obj.completed)
      })
    } else {
      props.setTickets({
        ...props.tickets,
        filteredTickets: filteredArr.filter(obj => !obj.completed)
      })
    }

  }, [filterString])

  useEffect(() => {
    if (counterComplete > 0) {
      console.log(counterComplete)
      updateTicketDB(updatedTicket)
    }
  },[updatedTicket, counterComplete])



  const handleUserChange = (e: any, i: number) => {
    const copyState = props.tickets.filteredTickets.slice();
    if (e.target.value === 'none') {
      copyState[i].assigneeId = null;
      props.setTickets({
        ...props.tickets,
        filteredTickets: copyState
      })
      setUpdatedTicket(copyState[i])
    } else {
      copyState[i].assigneeId = parseInt(e.target.value);
      props.setTickets({
        ...props.tickets,
        filteredTickets: copyState
      })
      setUpdatedTicket(copyState[i])
    }
}

const handleFilterChange = (e: any) => {
  const copyState = props.tickets.filteredTickets.slice();
  if (e.target.value === 'none') {
    setFilterString('none')
    props.setTickets({
      ...props.tickets,
      filteredTickets: props.tickets.allTickets
    })
  } else {
    if (e.target.value === 'completed') {
      setFilterString('completed')
      props.setTickets({
        ...props.tickets,
        filteredTickets: props.tickets.allTickets.filter(obj => obj.completed)
      })
    } else {
      setFilterString('not-completed')
      props.setTickets({
        ...props.tickets,
      filteredTickets: props.tickets.allTickets.filter(obj => !obj.completed)
      })
    }
  }
}

  const mappedTickets = props.tickets.filteredTickets.map((t, i) => (
    <div className={styles['ticket']} key={t.id}>
      {/* <h3>Ticket {t.id}</h3> */}
      <Link state={{ ticket: t }} to={{ pathname: "/details"}}>Ticket {t.id}</Link>
      <p>{t.description}</p>
      <div className={styles['buttons']} >
        <select defaultValue={'assign'} onChange={(e) => handleUserChange(e, i)} value={`${t.assigneeId}`} className={styles['select-options']}>
          <option value="assign" >Assign +</option>
          <option value="none" >None</option>
          <UserSelection />
        </select>
        <button onClick={() => handleClickComplete(i)} className={styles[t.completed ? 'completed-button' : 'incomplete-button']} >{t.completed ? 'Completed' : 'Not Complete'}</button>
      </div>
    </div>
  ))

  return (
    <div className={styles['tickets']}>
      <div className={styles['tickets-header']}>
        <h2>Tickets</h2>
        <AddTicketCard tickets={props.tickets} setTickets={props.setTickets} />
        <select defaultValue={'filter-status'} onChange={handleFilterChange} >
          <option value={'filter-status'} selected disabled >filter status</option>
          <option value="none" >None</option>
          <option value={'completed'} >Completed</option>
          <option value={'not-complete'} >Not Complete</option>
        </select>
      </div>
      {props.tickets.filteredTickets ? (
        <div className={styles['tickets-block']} >
          { mappedTickets }
        </div>
      ) : (
        <span>...</span>
      )}
    </div>
  );
}

export default Tickets;
