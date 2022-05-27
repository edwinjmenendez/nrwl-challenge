import React, { useEffect, useState } from 'react'
import { Ticket } from '@acme/shared-models';
import { UserSelection } from './UserSelection';
import './addTicketCard.css'

export interface TicketsProps {
    tickets: {
      allTickets: Ticket[],
      filteredTickets: Ticket[]
    };
    setTickets: any;
  }

export const AddTicketCard = ( props: TicketsProps ) => {

    const [newTicketModal, setNewTicketModal] = useState(false);
    const [newTicket, setNewTicket] = useState({} as Ticket)
    const [userSelection, setUserSelection]: any = useState(null);
    const [description, setDescription] = useState('');

    const addNewTicketDB = async () => {
        const location = `http://localhost:4200/api/tickets`
        const config = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTicket)
        };
        try {
            const fetchResponse = await fetch(location, config);
            const data = await fetchResponse.json();
            return data;
        } catch (e) {
            return e;
        }    
    
    }

    useEffect(() => {
        let copyState = props.tickets.allTickets;
        if (JSON.stringify(newTicket) === '{}') return;

        copyState.push(newTicket)
        props.setTickets({
            ...props.tickets,
            allTickets: copyState
        })
        addNewTicketDB() 
    }, [props.tickets.allTickets, newTicket])

    const handleChange = (e: any) => {
        if (e.target.value === 'none' || !e.target.value) {
            setUserSelection('none')
        } else {
            setUserSelection(e.target.value)
        }
    }

    const addTicket = () => {
        if (userSelection === null || description === '') return;
        if (userSelection === 'none') {
            setNewTicket({
                ...newTicket,
                completed: false,
                assigneeId: null,
                id: props.tickets.allTickets.length + 1,
                description: description
            })
            setDescription('')
        } else {
            setNewTicket({
                ...newTicket,
                completed: false,
                assigneeId: parseInt(userSelection),
                id: props.tickets.allTickets.length + 1,
                description: description
            })
            setDescription('')
        }
        
    }


  return (
      <>
        <button onClick={() => setNewTicketModal(true)}>New Ticket</button>
        {newTicketModal && 
        <div className='overlay' >
            <div className='modal-container' >
                <input placeholder='description' value={description} onChange={(e) => {setDescription(e.target.value)}} ></input>
                <select onChange={(e) => handleChange(e)}>
                 <option selected disabled >Select a User</option>
                 <option value="none" >None</option>
                    <UserSelection />
                 </select>
                <button onClick={() => addTicket()}>Add ticket</button>
            </div>
            <button onClick={() => setNewTicketModal(false)}>Close Modal</button>
        </div>
        }
      </>
  )
}
