import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
   const navigate = useNavigate();

   const [validationError, setValidationError] = useState(null);
   const [form, setForm] = useState({
      email: "",
      password: ""
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
      setValidationError(null);
   };

   const handleLogin = async (e) => {
      e.preventDefault();

      try {
         const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               email: form.email,        // <-- FIXED
               password: form.password
            }),
         });

         if (!response.ok) {
            const errorData = await response.json();
            setValidationError(errorData.error || "Login failed");
            return;
         }

         const data = await response.json();

         // Store token (backend only returns ONE token)
         localStorage.setItem("TCG_token", data.token);

         navigate("/");

      } catch (err) {
         console.error("Error during login:", err);
         setValidationError("Unexpected error occurred.");
      }
   };

   return (
      <main>
         <div className="loginPage">
            <h1 style={{ marginTop: "8rem" }}>Login</h1>

            <form className="loginForm" onSubmit={handleLogin}>
               {validationError && (
                  <p style={{ color: "red" }}>{validationError}</p>
               )}

               <div>
                  <label htmlFor="email">Email:</label>
                  <input
                     type="email"
                     id="email"
                     name="email"
                     value={form.email}
                     onChange={handleChange}
                     required
                  />
               </div>

               <div>
                  <label htmlFor="password">Password:</label>
                  <input
                     type="password"
                     id="password"
                     name="password"
                     value={form.password}
                     onChange={handleChange}
                     required
                  />
               </div>

               <button className="loginButton" type="submit">
                  Login
               </button>
            </form>

            <div>
               <p>
                  Don't have an account?{" "}
                  <span
                     style={{
                        color: "rgba(127, 239, 245, 1)",
                        cursor: "pointer",
                     }}
                     onClick={() => navigate("/Signup")}
                  >
                     <strong>Sign Up</strong>
                  </span>
               </p>
            </div>
         </div>
      </main>
   );
};

export default LoginPage;
