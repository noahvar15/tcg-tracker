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
            headers: { "Content-Type": "application/json" },
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

         const data = await response.json();
         localStorage.setItem("JWT_token", data.token);

         navigate("/login");
      } catch (error) {
         console.error("Sign up error:", error);
         setValidationError("Unexpected server error.");
      }
   };

   return (
      <main style={styles.page}>
         <div style={styles.card}>
            <h1 style={styles.title}>Sign Up</h1>

            <form style={styles.form} onSubmit={handleSignUp}>
               {validationError && <p style={styles.error}>{validationError}</p>}

               <div style={styles.field}>
                  <label htmlFor="fName" style={styles.label}>First Name:</label>
                  <input
                     type="text"
                     id="fName"
                     name="fName"
                     value={form.fName}
                     onChange={handleChange}
                     required
                     style={styles.input}
                  />
               </div>

               <div style={styles.field}>
                  <label htmlFor="mInit" style={styles.label}>Middle Initial:</label>
                  <input
                     type="text"
                     id="mInit"
                     name="mInit"
                     maxLength={1}
                     value={form.mInit}
                     onChange={handleChange}
                     style={styles.input}
                  />
               </div>

               <div style={styles.field}>
                  <label htmlFor="lName" style={styles.label}>Last Name:</label>
                  <input
                     type="text"
                     id="lName"
                     name="lName"
                     value={form.lName}
                     onChange={handleChange}
                     required
                     style={styles.input}
                  />
               </div>

               <div style={styles.field}>
                  <label htmlFor="email" style={styles.label}>Email:</label>
                  <input
                     type="email"
                     id="email"
                     name="email"
                     value={form.email}
                     onChange={handleChange}
                     required
                     style={styles.input}
                  />
               </div>

               <div style={styles.field}>
                  <label htmlFor="dob" style={styles.label}>Date of Birth:</label>
                  <input
                     type="date"
                     id="dob"
                     name="dob"
                     value={form.dob}
                     onChange={handleChange}
                     required
                     style={styles.input}
                  />
               </div>

               <div style={styles.field}>
                  <label htmlFor="password" style={styles.label}>Password:</label>
                  <input
                     type="password"
                     id="password"
                     name="password"
                     value={form.password}
                     onChange={handleChange}
                     required
                     style={styles.input}
                  />
               </div>

               <div style={styles.field}>
                  <label htmlFor="password2" style={styles.label}>Password Again:</label>
                  <input
                     type="password"
                     id="password2"
                     name="password2"
                     value={form.password2}
                     onChange={handleChange}
                     required
                     style={styles.input}
                  />
               </div>

               <button style={styles.button} type="submit">
                  Sign Up
               </button>
            </form>

            <p style={styles.signupText}>
               Have an account?{" "}
               <span style={styles.signupLink} onClick={() => navigate("/Login")}>
                  <strong>Login</strong>
               </span>
            </p>
         </div>
      </main>
   );
};

const styles = {
   page: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      background: "linear-gradient(180deg, #0d0d0d, #1a1a1a)",
      color: "white",
   },

   card: {
      width: "430px",
      padding: "2.5rem",
      borderRadius: "12px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
   },

   title: {
      marginBottom: "1.5rem",
      fontSize: "2rem",
      fontWeight: "700",
      color: "white",
   },

   form: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
   },

   field: {
      display: "flex",
      flexDirection: "column",
   },

   label: {
      marginBottom: "0.35rem",
      fontSize: "0.95rem",
      color: "#ddd",
   },

   input: {
      padding: "0.75rem",
      borderRadius: "6px",
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(0,0,0,0.3)",
      color: "white",
      fontSize: "1rem",
   },

   button: {
      marginTop: "0.75rem",
      padding: "0.8rem",
      backgroundColor: "rgba(0,0,0,0.3)",
      border: "none",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.2s",
   },

   error: {
      color: "red",
      fontWeight: "600",
      textAlign: "center",
   },

   signupText: {
      marginTop: "1rem",
      fontSize: "0.95rem",
      textAlign: "center",
      color: "#ccc",
   },

   signupLink: {
      color: "white",
      cursor: "pointer",
   },
};


export default SignUp;
