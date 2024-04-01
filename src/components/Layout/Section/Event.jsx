'use client'
import { EventCard, EventCardSkeleton } from '../../Data/Event';
import useEventsList from '@/src/app/api/events/useEventList';

export default function EventsSection() {
	const {loading, data, viewMoreEvents} = useEventsList();

  return (
    <section>
      <div className='mx-auto p-6'>
        <h1 className='section-header w-full my-2 text-4xl'>
          SỰ KIỆN HOT
        </h1>
        {loading ? (
          <div className="flex flex-wrap justify-center">
            {[...Array(4)].map((_, index) => (
              <EventCardSkeleton key={index}/>
            ))}
          </div>
        ) : (
        <div className='flex flex-wrap justify-center'>
          {data.map((event) => (
            <EventCard event={event} key={event._id}/>
          ))}
        </div>
        )}
        <h4 
          className='section-header w-full my-2 text-xl'
        >
          <span 
              className='hover:cursor-pointer hover:underline'
              onClick={viewMoreEvents}
          >
              Xem thêm
          </span>
        </h4>
      </div>
    </section>
)}