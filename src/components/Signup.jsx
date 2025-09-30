import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserPlus, CheckCircle } from "lucide-react";
import axios from 'axios';
import { BUTTON_CLASSES, FIELDS, Inputwrapper, MESSAGE_ERROR, MESSAGE_SUCCESS } from "../assets/dummy";

const API_URL = 'http://localhost:4000';
const INITIAL_FORM = { name: '', email: '', password: '' };

const Signup = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.post(`${API_URL}/api/users/register`, formData);
      console.log("Signup Success:", data);
      setMessage({ text: "Signup Success! Please Login", type: "success" });
      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error("Signup Error:", error);
      setMessage({
        text: error?.response?.data?.message || "Signup Failed! Please try again",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold">Create Account</h2>
        <p className="mb-4 text-grey-600">Join Qubic to manage your tasks</p>
      </div>

      {message.text && (
        <div className={message.type === "success" ? MESSAGE_SUCCESS : MESSAGE_ERROR}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
  {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
    <div key={name} className={Inputwrapper}>
      <Icon className="text-green-400 mr-2" />
      <input
        type={type}
        placeholder={placeholder}
        value={formData[name]}
        onChange={(e) => 
          setFormData({ ...formData, [name]: e.target.value })
        }
        className="w-full border border-grey-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  ))}
  <button type="submit" className={BUTTON_CLASSES} disabled={loading}>
    {loading ? 'Signing Up...' : 
      <>
        <UserPlus className="w-4 h-4 mr-2" />
        Sign up
      </>
  }
  </button>
</form>

      <p className="text-center text-sm text-grey-600 mt-6">
        Already have an account?{' '}
        <button onClick= {onSwitchMode} className="text-blue-500 hover:underline">
          Login
        </button>
      </p>
    </div>
       </div>
  );
};

export default Signup;