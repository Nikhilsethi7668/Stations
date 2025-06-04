"use client";
import  {useState } from 'react'

import { useRouter } from 'next/navigation'

export default function Dashboard() {

  const router = useRouter()
  const [trains, setTrains] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [routes, setRoutes] = useState([])
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState(null)

const fetchTrains = async () => {
  try {
    const data = await apiFetch('/trains')
    setTrains(data)
  } catch (e) {
    setError(e.message)
  }
}

  const fetchBookings=async() =>{
    try {
      const data = await apiFetch('/bookings')
      setBookings(data)
    } catch (e) {
      setError(e.message)
    }
  }

  const searchRoutes=async(e)=> {
    e.preventDefault()
    setError(null)
    try {
      const data = await apiFetch('/routes/find', {
        method: 'POST',
        body: JSON.stringify({ from, to }),
      })
      setRoutes(data)
    } catch (e) {
      setError(e.message)
    }
  }

  const bookTicket=async(route) =>{
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Login required')
      return
    }
    // For simplicity, booking the first train and stops from route
    try {
      // We need from_stop_id and to_stop_id -- in this minimal demo, let's skip and just alert
      alert('Booking feature coming soon with stop selection!')
    } catch (e) {
      alert('Booking failed: ' + e.message)
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {/* <button onClick={() => { logout(); router.push('/login') }}>Logout</button> */}

      <section>
        <h2>Trains</h2>
        <ul>
          {trains.map(t => (
            <li key={t.ID || t.id}>
              <strong>{t.Name || t.name}</strong> - Stops: {t.RouteStops?.map(s => s.Station?.Name || s.Station?.name).join(', ')}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Search Routes</h2>
        <form onSubmit={searchRoutes}>
          <input placeholder="From station" value={from} onChange={e => setFrom(e.target.value)} required />
          <input placeholder="To station" value={to} onChange={e => setTo(e.target.value)} required />
          <button type="submit">Find Routes</button>
        </form>

        {routes.length > 0 && (
          <ul>
            {routes.map((r, i) => (
              <li key={i}>
                Trains: {r.trains.join(', ')}<br />
                Stations: {r.stations.join(' → ')}<br />
                Stops: {r.total_stops}, Transfers: {r.transfers} <br />
                <button onClick={() => bookTicket(r)}>Book This Route</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Your Bookings</h2>
        <ul>
          {bookings.map(b => (
            <li key={b.ID || b.id}>
              Train: {b.Train?.Name || b.Train?.name} - Booked At: {new Date(b.BookedAt || b.bookedAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
