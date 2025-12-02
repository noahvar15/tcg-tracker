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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               email: form.email,
               password: form.password
            }),
         });

         if (!response.ok) {
            const errorData = await response.json();
            setValidationError(errorData.error || "Login failed");
            return;
         }

         const data = await response.json();
         localStorage.setItem("TCG_token", data.token);
         navigate("/");
      } catch (err) {
         console.error("Error during login:", err);
         setValidationError("Unexpected error occurred.");
      }
   };

   return (
      <main style={styles.page}>
         <div style={styles.card}>
            <h1 style={styles.title}>Login</h1>

            <form style={styles.form} onSubmit={handleLogin}>
               {validationError && (
                  <p style={styles.error}>{validationError}</p>
               )}

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

               <button style={styles.button} type="submit">
                  Login
               </button>
            </form>

            <p style={styles.signupText}>
               Don't have an account?{" "}
               <span style={styles.signupLink} onClick={() => navigate("/Signup")}>
                  <strong>Sign Up</strong>
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
      width: "380px",
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


export default LoginPage;
