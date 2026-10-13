import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./../styles/App.css";

const cities = [
  "Atlanta",
  "Austin",
  "Boston",
  "Chicago",
  "Dallas",
  "Denver",
  "Honolulu",
  "Las Vegas",
  "Los Angeles",
  "Miami",
  "New York",
  "Orlando",
  "Phoenix",
  "San Diego",
  "San Francisco",
  "Seattle",
  "Washington, D.C.",
];

const flights = [
  { airline: "Phoenix Air", code: "PA 218", depart: "08:15 AM", arrive: "10:32 AM", duration: "2h 17m", stops: "Nonstop", price: 189 },
  { airline: "Desert Skies", code: "DS 406", depart: "11:40 AM", arrive: "02:08 PM", duration: "2h 28m", stops: "Nonstop", price: 224 },
  { airline: "Phoenix Air", code: "PA 732", depart: "04:25 PM", arrive: "07:16 PM", duration: "2h 51m", stops: "1 stop", price: 157 },
];

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const navigate = (path) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
};

function RouteLink({ to, className, children }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          navigate(to);
        }
      }}
    >
      {children}
    </a>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <RouteLink to="/" className="brand" aria-label="Phoenix Airlines home">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span className="brand-name">PHOENIX <b>AIRLINES</b></span>
        </RouteLink>
        <nav className="main-nav" aria-label="Main navigation">
          <RouteLink to="/flight-search" className="nav-link">Flights</RouteLink>
          <a className="nav-link nav-link-muted" href="#why-phoenix">Why Phoenix</a>
          <RouteLink to="/flight-search" className="nav-cta">Book a flight <span aria-hidden="true">↗</span></RouteLink>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span className="footer-brand">✦ PHOENIX AIRLINES</span>
        <span>Find your next horizon.</span>
        <span>© 2025 Phoenix Airlines</span>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-content">
          <span className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> YOUR JOURNEY STARTS HERE</span>
          <h1>The world is<br />closer than <em>ever.</em></h1>
          <p>Thoughtful journeys. Exceptional skies.<br className="desktop-break" /> Let the adventure begin with Phoenix.</p>
          <RouteLink to="/flight-search" className="button button-light">
            Explore flights <span aria-hidden="true">→</span>
          </RouteLink>
          <div className="hero-proof">
            <div className="proof-avatars" aria-hidden="true"><span>J</span><span>M</span><span>A</span><span>+</span></div>
            <span>Loved by <strong>2 million+</strong> travelers</span>
          </div>
        </div>
        <div className="hero-skyline" aria-hidden="true">
          <div className="sun-disc" />
          <div className="mountain mountain-back" />
          <div className="mountain mountain-front" />
          <div className="flight-path">✦</div>
        </div>
        <div className="hero-caption"><span>01</span><span className="caption-line" /> A NEW PERSPECTIVE</div>
      </section>

      <section className="intro-section">
        <div className="intro-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> THE PHOENIX DIFFERENCE</span>
          <h2>Go further.<br /><em>Feel at home.</em></h2>
        </div>
        <div className="intro-detail">
          <p>From the moment you take off to the memories you bring home, we make every part of your journey feel a little more extraordinary.</p>
          <RouteLink to="/flight-search" className="text-link">Find your flight <span aria-hidden="true">↗</span></RouteLink>
        </div>
      </section>

      <section className="benefits-section" id="why-phoenix">
        <article className="benefit-card">
          <span className="benefit-icon" aria-hidden="true">✳</span>
          <span className="benefit-number">01 / COMFORT</span>
          <h3>Room to breathe</h3>
          <p>Settle into considered comfort, thoughtful details, and a little extra space to make the miles fly by.</p>
        </article>
        <article className="benefit-card benefit-card-featured">
          <span className="benefit-icon" aria-hidden="true">⌁</span>
          <span className="benefit-number">02 / CONNECTION</span>
          <h3>Closer to everywhere</h3>
          <p>Discover easy connections and inspiring destinations across the country and beyond.</p>
        </article>
        <article className="benefit-card">
          <span className="benefit-icon" aria-hidden="true">✧</span>
          <span className="benefit-number">03 / CARE</span>
          <h3>Here for your journey</h3>
          <p>Real people and genuine care, ready to help make your next trip your best one yet.</p>
        </article>
      </section>

      <section className="bottom-cta">
        <div><span className="eyebrow hero-eyebrow">YOUR NEXT CHAPTER AWAITS</span><h2>Somewhere wonderful<br />is waiting.</h2></div>
        <RouteLink to="/flight-search" className="button button-light">Find your flight <span aria-hidden="true">→</span></RouteLink>
      </section>
    </main>
  );
}

function FlightSearchPage() {
  const dispatch = useDispatch();
  const previousSearch = useSelector((state) => state.search);
  const selectedFlight = useSelector((state) => state.selectedFlight);
  const [tripType, setTripType] = useState(previousSearch ? previousSearch.tripType : "one-way");
  const [from, setFrom] = useState(previousSearch ? previousSearch.from : "");
  const [to, setTo] = useState(previousSearch ? previousSearch.to : "");
  const [departureDate, setDepartureDate] = useState(previousSearch ? previousSearch.departureDate : "");
  const [returnDate, setReturnDate] = useState(previousSearch ? previousSearch.returnDate : "");
  const [errors, setErrors] = useState({});
  const [hasSearched, setHasSearched] = useState(Boolean(previousSearch));

  useEffect(() => {
    if (!selectedFlight) return;
    setHasSearched(true);
  }, [selectedFlight]);

  const submitSearch = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!from.trim()) nextErrors.from = "Enter your departure city.";
    if (!to.trim()) nextErrors.to = "Enter your destination city.";
    if (from.trim() && to.trim() && from.trim().toLowerCase() === to.trim().toLowerCase()) {
      nextErrors.to = "Choose a destination different from your departure city.";
    }
    if (!departureDate) nextErrors.departureDate = "Choose a departure date.";
    else if (departureDate < today()) nextErrors.departureDate = "Departure date can't be in the past.";
    if (tripType === "round-trip") {
      if (!returnDate) nextErrors.returnDate = "Choose a return date.";
      else if (departureDate && returnDate < departureDate) nextErrors.returnDate = "Return date must be on or after departure.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    dispatch({
      type: "SEARCH_FLIGHTS",
      search: {
        tripType,
        from: from.trim(),
        to: to.trim(),
        departureDate,
        returnDate: tripType === "round-trip" ? returnDate : "",
      },
    });
    setHasSearched(true);
  };

  return (
    <main className="app-page">
      <section className="page-heading">
        <span className="eyebrow"><span className="eyebrow-dot" /> LET'S GET YOU THERE</span>
        <h1>Find your <em>flight.</em></h1>
        <p>Great trips start with a single search.</p>
      </section>

      <section className="search-panel panel">
        <div className="trip-toggle" role="group" aria-label="Trip type">
          <button type="button" className={tripType === "one-way" ? "trip-option active" : "trip-option"} onClick={() => { setTripType("one-way"); setErrors({}); }}>
            <span className="radio-mark" /> One way
          </button>
          <button type="button" className={tripType === "round-trip" ? "trip-option active" : "trip-option"} onClick={() => { setTripType("round-trip"); setErrors({}); }}>
            <span className="radio-mark" /> Round trip
          </button>
        </div>

        <form className="search-form" onSubmit={submitSearch} noValidate>
          <div className="route-fields">
            <div className="field-wrap">
              <label htmlFor="flight-from">FROM</label>
              <span className="field-icon" aria-hidden="true">⌖</span>
              <input id="flight-from" type="text" list="city-list" placeholder="Departure city" value={from} onChange={(event) => setFrom(event.target.value)} aria-invalid={Boolean(errors.from)} aria-describedby={errors.from ? "from-error" : undefined} />
              {errors.from && <span className="field-error" id="from-error">{errors.from}</span>}
            </div>
            <button type="button" className="swap-cities" aria-label="Swap departure and destination cities" onClick={() => { setFrom(to); setTo(from); }}><span aria-hidden="true">⇄</span></button>
            <div className="field-wrap">
              <label htmlFor="flight-to">TO</label>
              <span className="field-icon" aria-hidden="true">⌖</span>
              <input id="flight-to" type="text" list="city-list" placeholder="Where to?" value={to} onChange={(event) => setTo(event.target.value)} aria-invalid={Boolean(errors.to)} aria-describedby={errors.to ? "to-error" : undefined} />
              {errors.to && <span className="field-error" id="to-error">{errors.to}</span>}
            </div>
          </div>
          <datalist id="city-list">{cities.map((city) => <option value={city} key={city} />)}</datalist>
          <div className={tripType === "round-trip" ? "date-fields" : "date-fields one-date"}>
            <div className="field-wrap">
              <label htmlFor="departure-date">DEPARTURE</label>
              <span className="field-icon" aria-hidden="true">▦</span>
              <input id="departure-date" type="date" min={today()} value={departureDate} onChange={(event) => setDepartureDate(event.target.value)} aria-invalid={Boolean(errors.departureDate)} aria-describedby={errors.departureDate ? "departure-error" : undefined} />
              {errors.departureDate && <span className="field-error" id="departure-error">{errors.departureDate}</span>}
            </div>
            {tripType === "round-trip" && (
              <div className="field-wrap">
                <label htmlFor="return-date">RETURN</label>
                <span className="field-icon" aria-hidden="true">▦</span>
                <input id="return-date" type="date" min={departureDate || today()} value={returnDate} onChange={(event) => setReturnDate(event.target.value)} aria-invalid={Boolean(errors.returnDate)} aria-describedby={errors.returnDate ? "return-error" : undefined} />
                {errors.returnDate && <span className="field-error" id="return-error">{errors.returnDate}</span>}
              </div>
            )}
          </div>
          <button type="submit" className="button button-primary search-submit">Search flights <span aria-hidden="true">→</span></button>
        </form>
        <div className="search-assurance"><span aria-hidden="true">✦</span> No hidden fees. Just good journeys.</div>
      </section>

      {hasSearched && previousSearch && (
        <section className="results-section" aria-live="polite">
          <div className="results-heading">
            <div><span className="eyebrow"><span className="eyebrow-dot" /> YOUR OPTIONS</span><h2>{previousSearch.from} <span aria-hidden="true">→</span> {previousSearch.to}</h2></div>
            <div className="results-date">{formatDate(previousSearch.departureDate)}{previousSearch.tripType === "round-trip" ? ` · ${formatDate(previousSearch.returnDate)}` : ""}<span>{previousSearch.tripType === "round-trip" ? "Round trip" : "One way"} · 1 traveler</span></div>
          </div>
          <div className="flight-list">
            {flights.map((flight) => (
              <article className="flight-card panel" key={flight.code}>
                <div className="airline-badge" aria-hidden="true">{flight.airline === "Phoenix Air" ? "✦" : "D"}</div>
                <div className="airline-name"><strong>{flight.airline}</strong><span>{flight.code}</span></div>
                <div className="flight-time"><strong>{flight.depart}</strong><span>{previousSearch.from}</span></div>
                <div className="flight-duration"><span>{flight.duration}</span><span className="duration-line"><i /></span><span>{flight.stops}</span></div>
                <div className="flight-time"><strong>{flight.arrive}</strong><span>{previousSearch.to}</span></div>
                <div className="flight-price"><strong>${flight.price}</strong><span>/ person</span></div>
                <button type="button" className="button button-primary book-flight" onClick={() => { dispatch({ type: "SELECT_FLIGHT", flight }); navigate("/flight-booking"); }}>Select flight <span aria-hidden="true">→</span></button>
              </article>
            ))}
          </div>
          <p className="results-note">Prices shown are per traveler, including taxes and fees.</p>
        </section>
      )}
    </main>
  );
}

function FlightSummary({ search, flight }) {
  return (
    <div className="booking-summary">
      <div className="summary-top"><span className="eyebrow"><span className="eyebrow-dot" /> YOUR FLIGHT</span><span className="summary-trip">{search.tripType === "round-trip" ? "ROUND TRIP" : "ONE WAY"}</span></div>
      <div className="summary-route"><div><span>{search.from}</span><strong>{flight.depart}</strong></div><span className="summary-plane" aria-hidden="true">✈</span><div><span>{search.to}</span><strong>{flight.arrive}</strong></div></div>
      <div className="summary-meta"><span>{flight.airline} · {flight.code}</span><span>{formatDate(search.departureDate)}</span></div>
      {search.tripType === "round-trip" && <div className="summary-return">Return · {formatDate(search.returnDate)}</div>}
      <div className="summary-total"><span>Total per traveler</span><strong>${flight.price}</strong></div>
    </div>
  );
}

function BookingPage() {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search);
  const flight = useSelector((state) => state.selectedFlight);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  if (!search || !flight) {
    return (
      <main className="app-page empty-state">
        <span className="empty-icon" aria-hidden="true">✦</span>
        <h1>Your next trip starts <em>here.</em></h1>
        <p>Choose a flight first, then come back to complete your booking.</p>
        <RouteLink to="/flight-search" className="button button-primary">Search flights <span aria-hidden="true">→</span></RouteLink>
      </main>
    );
  }

  const confirmBooking = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (name.trim().length < 2) nextErrors.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    const digits = phone.replace(/\D/g, "");
    if (!/^[+().\-\s\d]+$/.test(phone) || digits.length < 10 || digits.length > 15) {
      nextErrors.phone = "Enter a phone number with 10–15 digits.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const confirmationCode = `PX${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    dispatch({
      type: "CONFIRM_BOOKING",
      passenger: { name: name.trim(), email: email.trim(), phone: phone.trim() },
      confirmationCode,
    });
    navigate("/confirmation");
  };

  return (
    <main className="app-page">
      <section className="page-heading">
        <span className="eyebrow"><span className="eyebrow-dot" /> ALMOST THERE</span>
        <h1>Make it <em>yours.</em></h1>
        <p>A few details and that window seat is yours.</p>
      </section>
      <div className="booking-layout">
        <section className="panel passenger-panel">
          <div className="panel-heading"><span className="step-number">01</span><div><h2>Passenger details</h2><p>Enter the details exactly as they appear on your ID.</p></div></div>
          <form className="passenger-form" onSubmit={confirmBooking} noValidate>
            <div className="field-wrap">
              <label htmlFor="passenger-name">FULL NAME</label>
              <input id="passenger-name" type="text" autoComplete="name" placeholder="e.g. Alex Morgan" value={name} onChange={(event) => setName(event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
              {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
            </div>
            <div className="field-wrap">
              <label htmlFor="passenger-email">EMAIL ADDRESS</label>
              <input id="passenger-email" type="text" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
              {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
            </div>
            <div className="field-wrap">
              <label htmlFor="passenger-phone">PHONE NUMBER</label>
              <input id="passenger-phone" type="text" inputMode="tel" autoComplete="tel" placeholder="(555) 123-4567" value={phone} onChange={(event) => setPhone(event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} />
              {errors.phone && <span className="field-error" id="phone-error">{errors.phone}</span>}
            </div>
            <button type="submit" className="button button-primary confirm-button">Confirm booking <span aria-hidden="true">→</span></button>
            <p className="secure-note"><span aria-hidden="true">♧</span> Your information is secure and will only be used for this booking.</p>
          </form>
        </section>
        <FlightSummary search={search} flight={flight} />
      </div>
    </main>
  );
}

function ConfirmationPage() {
  const search = useSelector((state) => state.search);
  const flight = useSelector((state) => state.selectedFlight);
  const passenger = useSelector((state) => state.passenger);
  const confirmationCode = useSelector((state) => state.confirmationCode);

  if (!confirmationCode || !search || !flight || !passenger) {
    return (
      <main className="app-page empty-state">
        <span className="empty-icon" aria-hidden="true">✦</span>
        <h1>No booking <em>just yet.</em></h1>
        <p>Once you select a flight and confirm your details, your trip will appear here.</p>
        <RouteLink to="/flight-search" className="button button-primary">Search flights <span aria-hidden="true">→</span></RouteLink>
      </main>
    );
  }

  return (
    <main className="app-page confirmation-page">
      <section className="confirmation-card panel">
        <div className="success-mark" aria-hidden="true">✓</div>
        <span className="eyebrow"><span className="eyebrow-dot" /> YOU'RE GOING PLACES</span>
        <h1>It's official,<br /><em>{passenger.name.split(" ")[0]}.</em></h1>
        <p className="confirmation-intro">Your next adventure is booked. We've sent the details to <strong>{passenger.email}</strong>.</p>
        <div className="confirmation-code"><span>CONFIRMATION CODE</span><strong>{confirmationCode}</strong></div>
        <div className="confirmation-details">
          <div><span>ROUTE</span><strong>{search.from} <span aria-hidden="true">→</span> {search.to}</strong></div>
          <div><span>DEPARTURE</span><strong>{formatDate(search.departureDate)}</strong></div>
          {search.tripType === "round-trip" && <div><span>RETURN</span><strong>{formatDate(search.returnDate)}</strong></div>}
          <div><span>FLIGHT</span><strong>{flight.airline} · {flight.code}</strong></div>
          <div><span>PASSENGER</span><strong>{passenger.name}</strong></div>
          <div><span>TRIP TYPE</span><strong>{search.tripType === "round-trip" ? "Round trip" : "One way"}</strong></div>
        </div>
        <button type="button" className="button button-primary home-button" onClick={() => navigate("/")}>Back to home <span aria-hidden="true">→</span></button>
        <p className="confirmation-note">Thank you for choosing Phoenix Airlines. Have a wonderful journey.</p>
      </section>
    </main>
  );
}

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", updatePath);
    return () => window.removeEventListener("popstate", updatePath);
  }, []);

  let page;
  if (path === "/flight-search") page = <FlightSearchPage />;
  else if (path === "/flight-booking") page = <BookingPage />;
  else if (path === "/confirmation") page = <ConfirmationPage />;
  else page = <LandingPage />;

  return (
    <div className="app-shell">
      <Header />
      {page}
      <Footer />
    </div>
  );
}

export default App;
