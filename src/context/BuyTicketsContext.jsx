'use client'
import { createContext, useContext, useEffect, useState } from 'react';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {

  const [tickets, setTickets] = useState([]);
  const [event, setEvent] = useState({});

  const onBuyTickets = (buyTickets, event) => {
    setTickets(buyTickets);
    setEvent(event);
  }

  return (
    <TicketContext.Provider value={{ 
      tickets,
      event,
      onBuyTickets
    }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => useContext(TicketContext);
