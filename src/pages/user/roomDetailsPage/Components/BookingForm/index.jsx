import "./BookingForm.scss";
import React, { useState } from 'react';
import { Modal } from 'antd';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoomInfo } from "../../../../../slices/bookingSlice";

function BookingForm({ data }) {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClickBooking = () => {
        dispatch(setRoomInfo({
            roomTypeId: data?.id,
            roomTypeName: data?.room_type_name,
            roomPrice: data?.room_price,
            roomImage: data?.image_urls?.[0]?.image_url
        }));
        if (!token) {
            setIsModalOpen(!isModalOpen)
        } else {
            sessionStorage.setItem("paymentAccess", true);
            navigate("/payment")
        }
    }
    return (
        <>
            <div className="form-booking" >
                <span className="title">Book Your Room</span>
                <button
                    className="btn"
                    onClick={handleClickBooking}
                >
                    BOOK NOW
                </button>
            </div>
            {/* modal */}
            <Modal
                className="modal"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(!isModalOpen);
                }}
                centered={true}
                footer={false}
            >
                <h3 className="title">PROCEED BOOKING</h3>
                <div className="border"></div>
                <div className="member">
                    <div className="item">
                        <h3 className="sub-title">ALREADY A MEMBER?</h3>
                        <Link className="btn" to={"/login"} onClick={() => {
                            sessionStorage.setItem("from", location.pathname)
                        }}>Sign In!</Link>
                    </div>
                    <div className="item">
                        <h3 className="sub-title">DON'T HAVE AN ACCOUNT? CREATE ONE.</h3>
                        <Link className="btn sign-up" to={"/register"} onClick={() => {
                            sessionStorage.setItem("from", location.pathname)
                        }}> Sign Up</Link>
                    </div>
                </div>
                <div className="border"></div>
                <div className="guest">
                    <h3 className="sub-title">OR CONTINUE AS GUEST</h3>
                    <Link className="btn" to={"/payment"} onClick={() => {
                        sessionStorage.setItem("paymentAccess", true);
                    }}>Continue As Guest</Link>
                </div>
            </Modal >
        </>
    );
}

export default BookingForm;