import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { getDoctorImage } from "../utils/doctorImage";
import { useEffect } from "react";

const getPaymentErrorMessage = (error, fallback) => {
  const status = error?.response?.status;
  if (!error?.response) return "We couldn't connect to the payment service. Please try again.";
  if (status === 401 || status === 403) return "Your session has expired. Please sign in again.";
  if (status === 409) return "This appointment has already been paid.";
  if (status === 400) return "This payment session is no longer valid. Please try again.";
  if (status >= 500) return "The payment service is temporarily unavailable. Please try again.";
  return fallback;
};

const Myappointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [upiApp, setUpiApp] = useState("Google Pay");
  const [paymentStatus, setPaymentStatus] = useState("ready");
  const [isPaying, setIsPaying] = useState(false);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.map((appointment) => ({
          ...appointment,
          docData: {
            ...appointment.docData,
            image: getDoctorImage(appointment.docData),
          },
        })));
        console.log(data.appointments);
      }
    } catch (error) {
      console.error("APPOINTMENTS LOAD ERROR:", error);
      toast.error("We couldn't load your appointments. Please try again.");
    }
  };
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.error(data.message);
        await getUserAppointments();
        await getDoctorsData();
      } else {
        toast.error("We couldn't cancel this appointment. Please try again.");
      }
    } catch (error) {
      console.error("APPOINTMENT CANCELLATION ERROR:", error);
      toast.error("We couldn't cancel this appointment. Please try again.");
    }
  };

  const payOnline = async (appointment) => {
    if (!token) {
      toast.warn("Please log in to continue");
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/create-payment",
        { appointmentId: appointment._id },
        { headers: { token } },
      );
      if (data.success) {
        setPayment({ appointment, paymentId: data.paymentId, amount: data.amount });
        setPaymentMethod("upi");
        setCard({ number: "", expiry: "", cvv: "" });
        setUpiId("");
        setUpiApp("Google Pay");
        setPaymentStatus("ready");
      } else {
        toast.error("We couldn't start the payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(getPaymentErrorMessage(error, "We couldn't start the payment. Please try again."));
    }
  };

  const confirmDemoPayment = async (event) => {
    event.preventDefault();
    if (paymentMethod === "upi") {
      if (!/^[\w.-]+@(okaxis|oksbi|okhdfcbank|okicici|ybl|upi)$/i.test(upiId.trim())) {
        toast.error("Use a demo UPI ID such as demo@okaxis");
        return;
      }
    } else {
      const digits = card.number.replace(/\s/g, "");
      if (digits !== "4242424242424242" || !/^\d{2}\/\d{2}$/.test(card.expiry) || !/^\d{3}$/.test(card.cvv)) {
        toast.error("Use the demo card details shown below");
        return;
      }
    }

    setIsPaying(true);
    setPaymentStatus("processing");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const { data } = await axios.post(
        backendUrl + "/api/user/confirm-payment",
        { appointmentId: payment.appointment._id, paymentId: payment.paymentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        setPaymentStatus("success");
        getUserAppointments();
        getDoctorsData();
      } else {
        setPaymentStatus("ready");
        toast.error("Payment could not be completed. Please try again.");
      }
    } catch (error) {
      setPaymentStatus("ready");
      console.error("Payment confirmation error:", error);
      toast.error(getPaymentErrorMessage(error, "Payment could not be completed. Please try again."));
    } finally {
      setIsPaying(false);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);
  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>
      <div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-6 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address: </p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className=" text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>

              <p className="text-xs mt-2">
                <span className="font-medium text-neutral-700">
                  Payment status:
                </span>{" "}
                <span
                  className={
                    item.payment
                      ? "text-green-600"
                      : "text-orange-600"
                  }
                >
                  {item.payment ? "Paid" : "Pending"}
                </span>
              </p>
            </div>
            <div>
              <div></div>
              <div className="flex flex-col gap-2 justify-end">
                {!item.cancelled && !item.payment && (
                  <button
                    onClick={() => payOnline(item)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    Pay Online
                  </button>
                )}

                {!item.cancelled && item.payment && (
                  <button
                    disabled
                    className="text-sm text-green-600 text-center sm:min-w-48 py-2 border border-green-500 rounded cursor-not-allowed"
                  >
                    Payment Successful
                  </button>
                )}

                {!item.cancelled && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    Cancel appointment
                  </button>
                )}
                {item.cancelled && (
                  <button className="sm:min-w-48 py-2 border border-red-500 text-red-500">
                    Appointment Cancelled
                  </button>
                )}
              </div>
              {payment?.appointment._id === item._id && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/50 p-4">
                  <form onSubmit={confirmDemoPayment} className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <div className="border-b border-zinc-100 bg-slate-50 px-6 py-4">
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="font-semibold tracking-wide text-primary">DOCTORCONNECT PAY</span>
                        <span className="rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-700">TEST MODE</span>
                      </div>
                    </div>
                    <div className="p-6">
                    <div className="mb-5 flex items-start justify-between">
                      <div>
                        <h2 className="mt-1 text-xl font-semibold text-zinc-900">Complete payment</h2>
                        <p className="mt-1 text-sm text-zinc-500">Appointment with {payment.appointment.docData.name}</p>
                      </div>
                      <button type="button" onClick={() => setPayment(null)} className="text-2xl leading-none text-zinc-400 hover:text-zinc-700" aria-label="Close payment dialog">
                        &times;
                      </button>
                    </div>
                    {paymentStatus === "success" ? (
                      <div className="py-6 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">✓</div>
                        <h3 className="mt-4 text-xl font-semibold text-zinc-900">Payment successful</h3>
                        <p className="mt-1 text-sm text-zinc-500">Your appointment is confirmed.</p>
                        <div className="mt-5 rounded-lg bg-zinc-50 p-4 text-left text-sm text-zinc-600">
                          <div className="flex justify-between"><span>Amount paid</span><strong className="text-zinc-900">₹ {Number(payment.amount).toLocaleString("en-IN")}</strong></div>
                          <div className="mt-2 flex justify-between"><span>Payment ID</span><span className="font-mono text-xs">{payment.paymentId}</span></div>
                        </div>
                        <button type="button" onClick={() => setPayment(null)} className="mt-5 w-full rounded-lg bg-primary py-3 text-sm font-medium text-white">Done</button>
                      </div>
                    ) : (
                    <>
                    <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                      <div className="flex justify-between"><span>Appointment fee</span><strong>₹ {Number(payment.amount).toLocaleString("en-IN")}</strong></div>
                      <div className="mt-2 flex justify-between text-xs text-blue-700"><span>Doctor</span><span>{payment.appointment.docData.name}</span></div>
                      <p className="mt-3 border-t border-blue-100 pt-2 text-xs text-blue-700">Secure checkout simulation. No money will be charged in test mode.</p>
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg bg-zinc-100 p-1">
                      <button type="button" onClick={() => setPaymentMethod("upi")} className={`rounded-md py-2 text-sm font-medium ${paymentMethod === "upi" ? "bg-white text-primary shadow-sm" : "text-zinc-500"}`}>UPI</button>
                      <button type="button" onClick={() => setPaymentMethod("card")} className={`rounded-md py-2 text-sm font-medium ${paymentMethod === "card" ? "bg-white text-primary shadow-sm" : "text-zinc-500"}`}>Card</button>
                    </div>
                    {paymentMethod === "upi" ? (
                      <>
                        <div className="mb-4 flex items-center gap-4 rounded-lg border border-zinc-200 p-3">
                          <div className="grid h-20 w-20 shrink-0 grid-cols-5 gap-1 rounded bg-zinc-900 p-2">
                            {[1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1].map((cell, index) => <span key={index} className={cell ? "bg-white" : "bg-zinc-900"} />)}
                          </div>
                          <div className="text-xs text-zinc-500">
                            <p className="font-medium text-zinc-800">Scan to pay</p>
                            <p className="mt-1">Use any UPI app to scan this demo QR.</p>
                            <p className="mt-1 text-primary">Test QR - no real transaction.</p>
                          </div>
                        </div>
                        <label className="mb-3 block text-sm font-medium text-zinc-700">
                          Choose UPI app
                          <select value={upiApp} onChange={(event) => setUpiApp(event.target.value)} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-normal outline-none focus:border-primary">
                            <option>Google Pay</option>
                            <option>PhonePe</option>
                            <option>Paytm</option>
                          </select>
                        </label>
                        <label className="mb-5 block text-sm font-medium text-zinc-700">
                          UPI ID
                          <input value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="demo@okaxis" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-primary" />
                          <span className="mt-1 block text-xs font-normal text-zinc-400">Demo ID: demo@okaxis</span>
                        </label>
                      </>
                    ) : (
                      <>
                        <label className="mb-3 block text-sm font-medium text-zinc-700">
                          Card number
                          <input value={card.number} onChange={(event) => setCard({ ...card, number: event.target.value })} inputMode="numeric" placeholder="4242 4242 4242 4242" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-primary" />
                        </label>
                        <div className="mb-5 flex gap-3">
                          <label className="block flex-1 text-sm font-medium text-zinc-700">Expiry<input value={card.expiry} onChange={(event) => setCard({ ...card, expiry: event.target.value })} inputMode="numeric" placeholder="12/30" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-primary" /></label>
                          <label className="block flex-1 text-sm font-medium text-zinc-700">CVV<input value={card.cvv} onChange={(event) => setCard({ ...card, cvv: event.target.value })} inputMode="numeric" placeholder="123" maxLength="3" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-primary" /></label>
                        </div>
                      </>
                    )}
                    <button disabled={isPaying} className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                      {isPaying ? "Processing securely..." : `Pay ₹ ${Number(payment.amount).toLocaleString("en-IN")}`}
                    </button>
                    <p className="mt-3 text-center text-xs text-zinc-400">🔒 Your payment details are encrypted in transit</p>
                    </>
                    )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Myappointments;
