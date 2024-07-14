import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config";

const currentUnixTimestamp = Math.floor(Date.now() / 1000);

// Base query with Authorization header
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.append("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// Base query without Authorization header
const baseQueryWithoutAuth = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
        return headers;
    },
});

export const bookingApi = createApi({
    reducerPath: "bookingManagement",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        createBooking: builder.mutation({
            query: (body) => ({
                url: `bookings/create-booking`,
                method: "POST",
                body: body,
            }),
        }),
        getBooking: builder.query({
            query: () => ({
                url: `bookings/get-bookings?page=0&size=${currentUnixTimestamp}`,
                method: "GET",
            }),
        }),
        getBookingDetails: builder.query({
            query: (bookingId) => ({
                url: `bookings/get-booking-detail/${bookingId}`,
                method: "GET",
            }),
        }),
        getBookingByHotel: builder.query({
            query: (hotelId) => {
                return {
                    url: `bookings/get-bookings-by-hotel/${hotelId}`,
                    method: "GET",
                };
            },
        }),
        changeStatus: builder.mutation({
            query: ({ bookingId, newStatus }) => ({
                url: `bookings/update-status/${bookingId}?newStatus=${newStatus}`,
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        exportBookingFull: builder.mutation({
            query: (body) => ({
                url: `bookings/export/bookings?partnerId=${body?.partnerId}&year=${body?.year}&month=${body?.month}&day=${body?.day}`,
                method: "GET",
                responseHandler: (response) => response.blob(), // Xử lý phản hồi dưới dạng Blob
            }),
        }),
        exportBookingYear: builder.mutation({
            query: (body) => ({
                url: `bookings/export/bookings?partnerId=${body?.partnerId}&year=${body?.year}`,
                method: "GET",
                responseHandler: (response) => response.blob(), // Xử lý phản hồi dưới dạng Blob
            }),
        }),
        exportBookingMonth: builder.mutation({
            query: (body) => ({
                url: `bookings/export/bookings?partnerId=${body?.partnerId}&year=${body?.year}&month=${body?.month}`,
                method: "GET",
                responseHandler: (response) => response.blob(), // Xử lý phản hồi dưới dạng Blob
            }),
        }),
    }),
});

export const {
    useCreateBookingMutation,
    useGetBookingQuery,
    useGetBookingDetailsQuery,
    useGetBookingByHotelQuery,
    useChangeStatusMutation,
    useExportBookingFullMutation,
    useExportBookingMonthMutation,
    useExportBookingYearMutation,
} = bookingApi;
