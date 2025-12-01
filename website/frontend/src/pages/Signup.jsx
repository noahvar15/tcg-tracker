import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
   const navigate = useNavigate();
   const [validationError, setValidationError] = useState(null);

   const [form, setForm] = useState({
      fName: "",
      mInit: "",
      lName: "",
      email: "",
      dob: "",
      password: "",
      password2: "",
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setValidationError(null);
   };

   const handleSignUp = async (e) => {
      e.preventDefault();

      if (form.password !== form.password2) {
         setValidationError("Passwords do not match.");
         return;
      }

      try {
         const response = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               first_name: form.fName,
               middle_initial: form.mInit,
               last_name: form.lName,
               email: form.email,
               dob: form.dob,
               password: form.password
            }),
         });

         if (!response.ok) {
            // Handle specific backend error codes
            if (response.status === 409) {
               setValidationError("Email already exists.");
               return;
            }

            if (response.status === 400) {
               setValidationError("Missing or invalid fields.");
               return;
            }

            if (response.status === 401) {
               setValidationError("Invalid signup credentials.");
               return;
            }

            const err = await response.json();
            setValidationError(err.error || "Signup failed.");
            return;
         }

         // If success:
         const data = await response.json();
         localStorage.setItem("JWT_token", data.token);

         navigate("/");

      } catch (error) {
         console.error("Sign up error:", error);
         setValidationError("Unexpected server error.");
      }
   };

   return (
      <main>
         <div className="loginPage">
            <h1 style={{ marginTop: "8rem" }}>Sign Up</h1>

            <form className="loginForm" onSubmit={handleSignUp}>
               {validationError && <p style={{ color: "red" }}>{validationError}</p>}

               <div>
                  <label htmlFor="fName">First Name:</label>
                  <input
                     type="text"
                     id="fName"
                     name="fName"
                     value={form.fName}
                     onChange={handleChange}
                     required
                  />
               </div>

               <div>
                  <label htmlFor="mInit">Middle Initial:</label>
                  <input
                     type="text"
                     id="mInit"
                     name="mInit"
                     maxLength={1}
                     value={form.mInit}
                     onChange={handleChange}
                  />
               </div>

               <div>
                  <label htmlFor="lName">Last Name:</label>
                  <input
                     type="text"
                     id="lName"
                     name="lName"
                     value={form.lName}
                     onChange={handleChange}
                     required
                  />
               </div>

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
                  <label htmlFor="dob">Date of Birth:</label>
                  <input
                     type="date"
                     id="dob"
                     name="dob"
                     value={form.dob}
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

               <div>
                  <label htmlFor="password2">Password Again:</label>
                  <input
                     type="password"
                     id="password2"
                     name="password2"
                     value={form.password2}
                     onChange={handleChange}
                     required
                  />
               </div>

               <button className="signUpButton" type="submit">Sign Up</button>
            </form>

            <div>
               <p>
                  Have an account?{" "}
                  <span
                     style={{
                        color: "rgba(127, 239, 245, 1)",
                        cursor: "pointer",
                     }}
                     onClick={() => navigate("/Login")}
                  >
                     <strong>Login</strong>
                  </span>
               </p>
            </div>
         </div>
      </main>
   );
};

export default SignUp;
