import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { customAxios } from '../api/axiosPrivate';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import registerImage from '../image/signup.png';
import Sidebar from '../views/Sidebar';
import { useNavigate } from 'react-router-dom';

const universitiesList = [{ id: 1, name: 'University of Dhaka', type: 'Public' }, { id: 2, name: 'University of Rajshahi', type: 'Public' }, { id: 3, name: 'Bangladesh Agricultural University', type: 'Public' }, { id: 4, name: 'Bangladesh University of Engineering & Technology', type: 'Public' }, { id: 5, name: 'University of Chittagong', type: 'Public' }, { id: 6, name: 'Jahangirnagar University', type: 'Public' }, { id: 7, name: 'Islamic University, Bangladesh', type: 'Public' }, { id: 8, name: 'Shahjalal University of Science and Technology', type: 'Public' }, { id: 9, name: 'Khulna University', type: 'Public' }, { id: 10, name: 'Bangabandhu Sheikh Mujib Medical University', type: 'Public' }, { id: 11, name: 'Bangabandhu Sheikh Mujibur Rahman Agricultural University', type: 'Public' }, { id: 12, name: 'Hajee Mohammad Danesh Science & Technology University', type: 'Public' }, { id: 13, name: 'Mawlana Bhashani Science and Technology University', type: 'Public' }, { id: 14, name: 'Patuakhali Science and Technology University', type: 'Public' }, { id: 15, name: 'Sher-e-Bangla Agricultural University', type: 'Public' }, { id: 16, name: 'Dhaka University of Engineering & Technology', type: 'Public' }, { id: 17, name: 'Rajshahi University of Engineering & Technology', type: 'Public' }, { id: 18, name: 'Chittagong University of Engineering & Technology', type: 'Public' }, { id: 19, name: 'Khulna University of Engineering & Technology', type: 'Public' }, { id: 20, name: 'Jagannath University', type: 'Public' }, { id: 21, name: 'Jatiya Kabi Kazi Nazrul Islam University', type: 'Public' }, { id: 22, name: 'Chittagong Veterinary and Animal Sciences University', type: 'Public' }, { id: 23, name: 'Sylhet Agricultural University', type: 'Public' }, { id: 24, name: 'Comilla University', type: 'Public' }, { id: 25, name: 'Noakhali Science and Technology University', type: 'Public' }, { id: 26, name: 'Jessore University of Science & Technology', type: 'Public' }, { id: 27, name: 'Pabna University of Science and Technology', type: 'Public' }, { id: 28, name: 'Bangladesh University of Professionals', type: 'Public' }, { id: 29, name: 'Begum Rokeya University', type: 'Public' }, { id: 30, name: 'Bangladesh University of Textiles', type: 'Public' }, { id: 31, name: 'University of Barisal', type: 'Public' }, { id: 32, name: 'Bangabandhu Sheikh Mujibur Rahman Science and Technology University', type: 'Public' }, { id: 33, name: 'Islamic Arabic University', type: 'Public' }, { id: 34, name: 'Bangabandhu Sheikh Mujibur Rahman Maritime University', type: 'Public' }, { id: 35, name: 'Rangamati Science and Technology University', type: 'Public' }, { id: 36, name: 'Dhaka International University', type: 'Private' }, { id: 37, name: 'Ahsanullah University of Science and Technology', type: 'Private' }, { id: 38, name: 'BRAC University', type: 'Private' }, { id: 39, name: 'East West University', type: 'Private' }, { id: 40, name: 'North South University', type: 'Private' }, { id: 41, name: 'American International University-Bangladesh', type: 'Private' }, { id: 42, name: 'Independent University, Bangladesh', type: 'Private' }, { id: 43, name: 'Bangladesh University of Business and Technology', type: 'Private' }, { id: 44, name: 'Gono Bishwabidyalay', type: 'Private' }, { id: 45, name: 'Hamdard University Bangladesh', type: 'Private' }, { id: 46, name: 'International Islamic University, Chittagong', type: 'Private' }, { id: 47, name: 'Chittagong Independent University (CIU)', type: 'Private' }, { id: 48, name: 'University of Science & Technology Chittagong', type: 'Private' }, { id: 49, name: 'Begum Gulchemonara Trust University', type: 'Private' }, { id: 50, name: 'East Delta University', type: 'Private' }, { id: 51, name: 'Bangladesh Army University of Science and Technology', type: 'Private' }, { id: 52, name: 'Bangladesh Army International University of Science & Technology', type: 'Private' }, { id: 53, name: 'Britannia University', type: 'Private' }, { id: 54, name: 'Feni University', type: 'Private' }, { id: 55, name: 'Bangladesh Army University of Engineering & Technology', type: 'Private' }, { id: 56, name: 'Premier University, Chittagong', type: 'Private' }, { id: 57, name: 'Exim Bank Agricultural University Bangladesh', type: 'Private' }, { id: 58, name: 'Southern University, Bangladesh', type: 'Private' }, { id: 59, name: 'Port City International University', type: 'Private' }, { id: 60, name: 'Coxs Bazar International University', type: 'Private' }, { id: 61, name: 'Notre Dame University Bangladesh', type: 'Private' }, { id: 62, name: 'Asian University of Bangladesh', type: 'Private' }, { id: 63, name: 'Asa University Bangladesh', type: 'Private' }, { id: 64, name: 'Atish Dipankar University of Science and Technology', type: 'Private' }, { id: 65, name: 'Bangladesh Islami University', type: 'Private' }, { id: 66, name: 'Bangladesh University', type: 'Private' }, { id: 67, name: 'Central Women\'s University', type: 'Private' }, { id: 68, name: 'City University, Bangladesh', type: 'Private' }, { id: 69, name: 'Daffodil International University', type: 'Private' }, { id: 70, name: 'Eastern University, Bangladesh', type: 'Private' }, { id: 71, name: 'Green University of Bangladesh', type: 'Private' }, { id: 72, name: 'IBAIS University', type: 'Private' }, { id: 73, name: 'Sonargaon University', type: 'Private' }, { id: 74, name: 'International University of Business Agriculture and Technology', type: 'Private' }, { id: 75, name: 'Manarat International University', type: 'Private' }, { id: 76, name: 'Millennium University', type: 'Private' }, { id: 77, name: 'Northern University, Bangladesh', type: 'Private' }, { id: 78, name: 'North Western University, Bangladesh', type: 'Private' }, { id: 79, name: 'People\'s University of Bangladesh', type: 'Private' }, { id: 80, name: 'Presidency University', type: 'Private' }, { id: 81, name: 'Pundra University of Science and Technology', type: 'Private' }, { id: 82, name: 'Prime University', type: 'Private' }, { id: 83, name: 'European University of Bangladesh', type: 'Private' }, { id: 84, name: 'Primeasia University', type: 'Private' }, { id: 85, name: 'Queens University', type: 'Private' }, { id: 86, name: 'Rajshahi Science & Technology University', type: 'Private' }, { id: 87, name: 'Royal University of Dhaka', type: 'Private' }, { id: 88, name: 'Shanto-Mariam University of Creative Technology', type: 'Private' }, { id: 89, name: 'Southeast University', type: 'Private' }, { id: 90, name: 'Stamford University Bangladesh', type: 'Private' }, { id: 91, name: 'State University of Bangladesh', type: 'Private' }, { id: 92, name: 'United International University', type: 'Private' }, { id: 93, name: 'University of Asia Pacific (Bangladesh)', type: 'Private' }, { id: 94, name: 'University of Development Alternative', type: 'Private' }, { id: 95, name: 'University of Information Technology and Sciences', type: 'Private' }, { id: 96, name: 'University of Liberal Arts Bangladesh', type: 'Private' }, { id: 97, name: 'Fareast International University', type: 'Private' }, { id: 98, name: 'University of South Asia, Bangladesh', type: 'Private' }, { id: 99, name: 'Uttara University', type: 'Private' }, { id: 100, name: 'Victoria University of Bangladesh', type: 'Private' }, { id: 101, name: 'Varendra University', type: 'Private' }, { id: 102, name: 'World University of Bangladesh', type: 'Private' }, { id: 103, name: 'Leading University', type: 'Private' }, { id: 104, name: 'Metropolitan University', type: 'Private' }, { id: 105, name: 'North East University Bangladesh', type: 'Private' }, { id: 106, name: 'Sylhet International University', type: 'Private' }, { id: 107, name: 'Khwaja Yunus Ali University', type: 'Private' }, { id: 108, name: 'Global University Bangladesh', type: 'Private' }, { id: 109, name: 'University of Creative Technology Chittagong', type: 'Private' }, { id: 110, name: 'Z H Sikder University of Science & Technology', type: 'Private' }, { id: 111, name: 'Central University of Science and Technology', type: 'Private' }, { id: 112, name: 'Canadian University of Bangladesh', type: 'Private' }, { id: 113, name: 'First Capital University of Bangladesh', type: 'Private' }, { id: 114, name: 'Ishaka International University', type: 'Private' }, { id: 115, name: 'Northern University of Business & Technology, Khulna', type: 'Private' }, { id: 116, name: 'North Bengal International University', type: 'Private' }, { id: 117, name: 'Ranada Prasad Shaha University', type: 'Private' }, { id: 118, name: 'Islamic University of Technology', type: 'International' }, { id: 119, name: 'Asian University for Women', type: 'International' }, { id: 120, name: 'Bangladesh Open University', type: 'Special' }, { id: 121, name: 'National University of Bangladesh', type: 'Special' }, { id: 122, name: 'Islamic Arabic University', type: 'Special' }];



const Register = () => {
  const [auth, setAuth] = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    varsity: '',
    department: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [departments, setDepartments] = useState(['EEE', 'CSE', 'CE', 'MPE', 'TE']);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUniversityChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      varsity: value,
    });

    if (value.length > 0) {
      const filtered = universitiesList.filter((university) =>
        university.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUniversities(filtered);
    } else {
      setFilteredUniversities([]);
    }
  };

  const handleUniversitySelect = (university) => {
    setFormData({
      ...formData,
      varsity: university.name,
    });
    setFilteredUniversities([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await customAxios.post('/auth/register', formData);

      setAuth({
        ...auth,
        user: response.data.user,
        token: response.data.access_token,
      });
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Registration successful!', {
        position: 'bottom-right',
        autoClose: 3000,
      });

      navigate('/');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Something went wrong');
        toast.error(err.response.data.message || 'Something went wrong', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      } else {
        setError('Failed to connect to the server.');
        toast.error('Failed to connect to the server.', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      }
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white fixed inset-0 sm:pl-60">
      <Sidebar isOpen={false} onClose={() => { }} />
      <div className="flex w-full max-w-6xl bg-white rounded-lg overflow-hidden mx-auto">
        <div className="hidden md:flex w-1/3 items-center justify-center bg-transparent">
          <img
            src={registerImage}
            alt="Login Illustration"
            className="w-full max-w-xs mx-auto rounded-md"
          />
        </div>

        <div className="w-full md:w-2/3 p-8 bg-white">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Sign Up</h2>
          {/* <p className="text-gray-600 mb-6">Create an account to unlock all the amazing features.</p> */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label className="block text-gray-700 font-medium mb-1 ml-0">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
              />
            </div>
            <div className="md:col-span-1 relative">
              <label className="block text-gray-700 font-medium mb-1">University</label>
              <input
                type="text"
                name="university"
                value={formData.varsity}
                onChange={handleUniversityChange}

                placeholder="Enter your university"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
              />
              {filteredUniversities.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto border border-gray-300 rounded-md bg-white">
                  {filteredUniversities.map((university) => (
                    <li
                      key={university.id}
                      onClick={() => handleUniversitySelect(university)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {university.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="md:col-span-1">
              <label className="block text-gray-700 font-medium mb-1">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}

                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
              >
                <option value="">Select Department</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Already have an account? <a href="/login" className="text-green-700 font-bold hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
