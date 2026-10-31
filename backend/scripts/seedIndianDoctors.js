import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";

const doctors = [
  {
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@doctorconnect.demo",
    speciality: "General physician",
    degree: "MBBS, MD",
    experience: "12 Years",
    about: "Dr. Rajesh Kumar provides comprehensive primary care, preventive medicine, and chronic disease management.",
    fees: 600,
    image: "local:doc1",
    address: { line1: "12 MG Road", line2: "Bengaluru, Karnataka" },
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@doctorconnect.demo",
    speciality: "Gynecologist",
    degree: "MBBS, MD",
    experience: "9 Years",
    about: "Dr. Priya Sharma provides compassionate women's health, maternity, and preventive care.",
    fees: 700,
    image: "local:doc2",
    address: { line1: "44 Park Street", line2: "Kolkata, West Bengal" },
  },
  {
    name: "Dr. Amit Verma",
    email: "amit.verma@doctorconnect.demo",
    speciality: "Cardiologist",
    degree: "MBBS, DM",
    experience: "14 Years",
    about: "Dr. Amit Verma focuses on heart health, diagnostics, and long-term prevention.",
    fees: 1000,
    image: "local:doc3",
    address: { line1: "21 Civil Lines", line2: "New Delhi, Delhi" },
  },
  {
    name: "Dr. Vikram Singh",
    email: "vikram.singh@doctorconnect.demo",
    speciality: "Neurologist",
    degree: "MBBS, DM",
    experience: "11 Years",
    about: "Dr. Vikram Singh treats neurological conditions with a patient-first approach.",
    fees: 900,
    image: "local:doc4",
    address: { line1: "7 Anna Salai", line2: "Chennai, Tamil Nadu" },
  },
  {
    name: "Dr. Neha Kapoor",
    email: "neha.kapoor@doctorconnect.demo",
    speciality: "Dermatologist",
    degree: "MBBS, MD",
    experience: "8 Years",
    about: "Dr. Neha Kapoor offers evidence-based skin, hair, and cosmetic dermatology care.",
    fees: 800,
    image: "local:doc5",
    address: { line1: "18 Marine Drive", line2: "Kochi, Kerala" },
  },
  {
    name: "Dr. Sanjay Patel",
    email: "sanjay.patel@doctorconnect.demo",
    speciality: "Pediatricians",
    degree: "MBBS, DCH",
    experience: "10 Years",
    about: "Dr. Sanjay Patel provides friendly, comprehensive care for children and families.",
    fees: 600,
    image: "local:doc6",
    address: { line1: "5 CG Road", line2: "Ahmedabad, Gujarat" },
  },
  {
    name: "Dr. Arjun Mehta",
    email: "arjun.mehta@doctorconnect.demo",
    speciality: "General physician",
    degree: "MBBS, MD",
    experience: "7 Years",
    about: "Dr. Arjun Mehta provides reliable primary care and personalized treatment plans.",
    fees: 550,
    image: "local:doc7",
    address: { line1: "32 FC Road", line2: "Pune, Maharashtra" },
  },
  {
    name: "Dr. Pooja Iyer",
    email: "pooja.iyer@doctorconnect.demo",
    speciality: "Gynecologist",
    degree: "MBBS, MS",
    experience: "13 Years",
    about: "Dr. Pooja Iyer supports women's health with caring consultations and treatment.",
    fees: 750,
    image: "local:doc8",
    address: { line1: "9 Residency Road", line2: "Bengaluru, Karnataka" },
  },
  {
    name: "Dr. Kavita Rao",
    email: "kavita.rao@doctorconnect.demo",
    speciality: "Dermatologist",
    degree: "MBBS, MD",
    experience: "6 Years",
    about: "Dr. Kavita Rao treats common and complex skin conditions with modern care.",
    fees: 700,
    image: "local:doc9",
    address: { line1: "16 Banjara Hills", line2: "Hyderabad, Telangana" },
  },
  {
    name: "Dr. Rohit Malhotra",
    email: "rohit.malhotra@doctorconnect.demo",
    speciality: "Cardiologist",
    degree: "MBBS, DM",
    experience: "15 Years",
    about: "Dr. Rohit Malhotra specializes in cardiac evaluation, prevention, and treatment.",
    fees: 1100,
    image: "local:doc10",
    address: { line1: "28 Sector 17", line2: "Chandigarh, Punjab" },
  },
];

await mongoose.connect(process.env.MONGODB_URI);
const password = await bcrypt.hash("doctor123", 10);

await doctorModel.deleteMany({});
await doctorModel.insertMany(
  doctors.map((doctor, index) => ({
    ...doctor,
    password,
    available: true,
    date: Date.now() + index,
    slots_booked: {},
  })),
);

console.log(`Reset doctor catalog with ${doctors.length} doctors.`);
await mongoose.disconnect();
