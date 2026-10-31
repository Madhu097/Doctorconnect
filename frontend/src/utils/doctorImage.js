import { doctorImages } from "../assets/images/assets";

const seededDoctorImages = {
  "rajesh.kumar@doctorconnect.demo": "doc1",
  "priya.sharma@doctorconnect.demo": "doc2",
  "amit.verma@doctorconnect.demo": "doc3",
  "vikram.singh@doctorconnect.demo": "doc4",
  "neha.kapoor@doctorconnect.demo": "doc5",
  "sanjay.patel@doctorconnect.demo": "doc6",
  "arjun.mehta@doctorconnect.demo": "doc7",
  "pooja.iyer@doctorconnect.demo": "doc8",
  "kavita.rao@doctorconnect.demo": "doc9",
  "rohit.malhotra@doctorconnect.demo": "doc10",
};

const seededDoctorImagesByName = {
  "rajesh kumar": "doc1",
  "priya sharma": "doc2",
  "amit verma": "doc3",
  "vikram singh": "doc4",
  "neha kapoor": "doc5",
  "sanjay patel": "doc6",
  "arjun mehta": "doc7",
  "pooja iyer": "doc8",
  "kavita rao": "doc9",
  "rohit malhotra": "doc10",
};

export const getDoctorImage = (doctor) => {
  const emailKey = doctor?.email?.trim().toLowerCase();
  const nameKey = doctor?.name
    ?.trim()
    .toLowerCase()
    .replace(/^dr\.?\s+/, "");
  const imageKey =
    seededDoctorImages[emailKey] || seededDoctorImagesByName[nameKey];

  return doctorImages[imageKey] || doctor?.image;
};
