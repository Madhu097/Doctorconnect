import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [Speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("form submitted");

    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }
      if (!backendUrl) {
        toast.error("Backend URL is not configured");
        return;
      }
      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", Speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({
          line1: address1,
          line2: address2,
        }),
      );

      console.log("form data:");

      //console log formdata
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            atoken: aToken,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false)
        setName("")
        setPassword("")
        setEmail("")
        setAddress1("")
        setAddress2("")
        setDegree("")
        setAbout("")
        setFees("")
      } else {
        toast.error(data.message || "Failed to add doctor");
        
      }
    } catch (error) {
  console.error("Add doctor error:", error.response?.data || error.message);
  toast.error(error.response?.data?.message || "Something went wrong");
}
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="m-4 sm:m-6 w-full max-w-6xl text-slate-700"
    >
      <p className="mb-2 text-2xl font-bold tracking-tight text-slate-800">
        Add Doctor
      </p>

      <p className="mb-6 text-sm text-slate-500">
        Add a new doctor to your healthcare management system.
      </p>

      <div className="bg-white px-5 py-6 sm:px-8 sm:py-8 border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto shadow-sm">
        {/* Doctor Image Upload */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-slate-100">
          <label htmlFor="doc-img" className="relative cursor-pointer group">
            <img
              className="w-20 h-20 sm:w-24 sm:h-24 p-2 object-contain bg-slate-50 border-2 border-dashed border-slate-300 rounded-full transition-all duration-200 group-hover:border-blue-500 group-hover:bg-blue-50"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload doctor picture"
            />

            <span className="absolute bottom-0 right-0 w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-full text-lg shadow-md">
              +
            </span>
          </label>

          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            accept="image/*"
            hidden
          />

          <div>
            <p className="text-sm font-semibold text-slate-700">
              Upload Doctor Picture
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Upload a profile picture for the doctor.
            </p>

            <span className="inline-block mt-2 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md">
              PNG, JPG or JPEG
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          {/* Left Column */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-700">
                Doctor Name
              </p>

              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Enter doctor's full name"
                required
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-700">
                Doctor Email
              </p>

              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="doctor@example.com"
                required
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-700">
                Doctor Password
              </p>

              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Enter password"
                required
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-700">
                Doctor Experience
              </p>

              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none bg-white cursor-pointer transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Years</option>
                <option value="3 Year">3 Years</option>
                <option value="4 Year">4 Years</option>
                <option value="5 Year">5 Years</option>
                <option value="6 Year">6 Years</option>
                <option value="7 Year">7 Years</option>
                <option value="8 Year">8 Years</option>
                <option value="9 Year">9 Years</option>
                <option value="10 Year">10 Years</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-700">
                Doctor Fees
              </p>

              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                type="number"
                placeholder="Enter consultation fees"
                min="0"
                required
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-700">Speciality</p>

              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={Speciality}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none bg-white cursor-pointer transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="General Physician">General Physician</option>
                <option value="Gyncologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-700">Education</p>

              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                type="text"
                placeholder="e.g. MBBS, MD"
                required
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-700">
                Address Line 1
              </p>

              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                type="text"
                placeholder="Street address"
                required
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-700">
                Address Line 2
              </p>

              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                type="text"
                placeholder="City, state, or additional address"
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-700">
                About Doctor
              </p>

              <textarea
                onChange={(e) => setAbout(e.target.value)}
                value={about}
                placeholder="Write about the doctor's qualifications, experience, and expertise..."
                rows={5}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none resize-y transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">
          <button
            type="submit"
            className="w-full sm:w-auto min-w-44 flex items-center justify-center gap-3 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200"
          >
            Add Doctor
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;
