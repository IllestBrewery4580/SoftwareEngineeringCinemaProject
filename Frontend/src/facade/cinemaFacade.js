const BASE_URL = "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let errorText = "";
    try {
      errorText = await res.text();
    } catch (e) {
      // ignore
    }
    throw new Error(
      `Request failed: ${res.status} ${res.statusText} ${errorText}`
    );
  }

  // no content
  if (res.status === 204) return null; 
  return res.json();
}

// ------------
// Auth Facade
// ------------
class AuthFacade {
  async register(userData) {
    // POST /accounts/register/
    return request("/accounts/register/", {
      method: "POST",
      body: userData,
    });
  }

  async login(credentials) {
    // POST /accounts/login/
    return request("/accounts/login/", {
      method: "POST",
      body: credentials,
    });
  }

  async logout() {
    // GET /accounts/logout/
    return request("/accounts/logout/", {
      method: "GET",
    });
  }

  async getProfile() {
    return request("/accounts/profile/", {
      method: "GET",
    });
  }
}

// ----------------------
// Movie & Booking Facade
// ----------------------
class BookingFacade {
  async listMovies() {
    // GET /api/movies/
    return request("/api/movies/", {
      method: "GET",
    });
  }

  async getMovieDetails(movieId) {
    return request(`/api/movies/${movieId}/`, {
      method: "GET",
    });
  }

  // These are stubs you can wire later if needed
  async getShowtimesForMovie(movieId) {
    return request(`/api/movies/${movieId}/showtimes/`, {
      method: "GET",
    });
  }

  async startBooking(showtimeId, tickets) {
    return request("/api/bookings/start/", {
      method: "POST",
      body: {
        showtime_id: showtimeId,
        tickets,
      },
    });
  }

  async selectSeats(bookingId, seatIds) {
    return request("/api/bookings/select-seats/", {
      method: "POST",
      body: {
        booking_id: bookingId,
        seat_ids: seatIds,
      },
    });
  }

  async getBookingSummary(bookingId) {
    return request(`/api/bookings/${bookingId}/summary/`, {
      method: "GET",
    });
  }
}

// -------------
// Admin Facade 
// -------------
class AdminFacade {
  async getMovies() {
    return request("/api/movies/", { method: "GET" });
  }

  async addMovie(movieData) {
    return request("/api/movies/", {
      method: "POST",
      body: movieData,
    });
  }

  async getShowrooms() {
    return request("/api/showrooms/", {
      method: "GET",
    });
  }

  async scheduleShowtime(showtimeData) {
    return request("/api/showtimes/", {
      method: "POST",
      body: showtimeData,
    });
  }

  async createPromotion(promoData) {
    return request("/api/promotions/", {
      method: "POST",
      body: promoData,
    });
  }

  async sendPromotion(promoCode) {
    return request("/api/promotions/send/", {
      method: "POST",
      body: { code: promoCode },
    });
  }
}

export const authFacade = new AuthFacade();
export const bookingFacade = new BookingFacade();
export const adminFacade = new AdminFacade();