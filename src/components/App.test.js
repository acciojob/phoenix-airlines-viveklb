import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import store from "../store";

const dateFromToday = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const renderAt = (path) => {
  window.history.replaceState({}, "", path);
  return render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const searchForFlights = (roundTrip = false) => {
  if (roundTrip) fireEvent.click(screen.getByRole("button", { name: /round trip/i }));
  fireEvent.change(screen.getByLabelText("FROM"), { target: { value: "Phoenix" } });
  fireEvent.change(screen.getByLabelText("TO"), { target: { value: "San Francisco" } });
  fireEvent.change(screen.getByLabelText("DEPARTURE"), { target: { value: dateFromToday(3) } });
  if (roundTrip) {
    fireEvent.change(screen.getByLabelText("RETURN"), { target: { value: dateFromToday(7) } });
  }
  fireEvent.click(screen.getByRole("button", { name: /search flights/i }));
};

beforeEach(() => {
  store.dispatch({ type: "RESET_BOOKING" });
  window.scrollTo = jest.fn();
});

test("searches and confirms a one-way booking with validated passenger details", () => {
  renderAt("/flight-search");
  searchForFlights();

  expect(screen.getAllByText("Phoenix", { selector: "span" }).length).toBeGreaterThan(0);
  expect(screen.getAllByText("San Francisco", { selector: "span" }).length).toBeGreaterThan(0);
  fireEvent.click(document.querySelector(".book-flight"));
  expect(screen.getByRole("heading", { name: /make it yours/i })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
  expect(screen.getByText("Please enter your full name.")).toBeTruthy();
  expect(screen.getByText("Enter a valid email address.")).toBeTruthy();
  expect(screen.getByText("Enter a phone number with 10–15 digits.")).toBeTruthy();

  fireEvent.change(screen.getByLabelText("FULL NAME"), { target: { value: "Taylor Morgan" } });
  fireEvent.change(screen.getByLabelText("EMAIL ADDRESS"), { target: { value: "taylor@example.com" } });
  fireEvent.change(screen.getByLabelText("PHONE NUMBER"), { target: { value: "5551234567abc" } });
  fireEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
  expect(screen.getByText("Enter a phone number with 10–15 digits.")).toBeTruthy();
  fireEvent.change(screen.getByLabelText("PHONE NUMBER"), { target: { value: "5551234567" } });
  fireEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

  expect(screen.getByRole("heading", { name: /it's official/i })).toBeTruthy();
  expect(document.querySelector(".confirmation-details").textContent).toContain("Phoenix");
  expect(document.querySelector(".confirmation-details").textContent).toContain("San Francisco");
  expect(screen.getByText(/PX[A-Z0-9]{6}/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /back to home/i }));
  expect(screen.getByRole("heading", { name: /the world is closer than ever/i })).toBeTruthy();
});

test("includes a return date in a round-trip itinerary", () => {
  renderAt("/flight-search");
  searchForFlights(true);
  fireEvent.click(document.querySelector(".book-flight"));

  expect(screen.getByText(/ROUND TRIP/)).toBeTruthy();
  expect(screen.getByText(new RegExp(`Return · ${new Date(`${dateFromToday(7)}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}`))).toBeTruthy();
});
