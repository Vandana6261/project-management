// import React, { useState } from "react";
// import Login from "./Login";
// import Signup from "./Signup";

// function Auth() {
//   const [active, setActive] = useState("signIn");

//   return (
//     <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 w-full select-none">
//       {/* Container Card with subtle glass tint & modern scaling */}
//       <div className="p-8 rounded-2xl bg-[#1f1f1f] backdrop-blur-2xl border border-white/5 w-full max-w-md shadow-2xl shadow-black flex flex-col gap-6">
        
//         {/* Modern Pill Switcher Header */}
//         <div className=" p-1 rounded-xl flex items-center border border-white/5">
//           <button 
//             type="button"
//             className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
//               active === "signIn" 
//                 ? "bg-[#07BAA5] text-white shadow-md shadow-[#07BAA5]/20" 
//                 : "bg-transparent text-zinc-400 hover:text-zinc-200"
//             }`}
//             onClick={() => setActive("signIn")}
//           >
//             Sign In
//           </button>
//           <button 
//             type="button"
//             className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
//               active === "signUp" 
//                 ? "bg-[#07BAA5] text-white shadow-md shadow-[#07BAA5]/20" 
//                 : "bg-transparent text-zinc-400 hover:text-zinc-200"
//             }`}
//             onClick={() => setActive("signUp")}
//           >
//             Sign Up
//           </button>
//         </div>

//         {/* Dynamic Titles */}
//         <div className="text-center">
//           <h2 className="text-2xl font-bold tracking-tight text-white transition-all">
//             {active === "signUp" ? "Create your account" : "Welcome Back"}
//           </h2>
//           <p className="mt-1.5 text-xs text-zinc-400">
//             {active === "signUp" ? "Join us today! Please enter your details." : "Enter your credentials to access your account."}
//           </p>
//         </div>

//         {/* Form Area */}
//         <div className="mt-2">
//           {active === "signIn" ? <Login /> : <Signup />}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Auth;





import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

// Shared Switcher Button Component Class (reused for both Sign In and Sign Up buttons)
const switcherBtnBase = "w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer";

function Auth() {
  const [active, setActive] = useState("signIn");

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-12 sm:px-6 lg:px-8 w-full select-none transition-colors">
      {/* Container Card using your semantic theme color and a smooth backdrop blur */}
      <div className="p-8 rounded-2xl bg-card/40 backdrop-blur-2xl border border-cardBorder w-full max-w-md shadow-2xl shadow-black flex flex-col gap-6">
        
        {/* Modern Pill Switcher Header Container */}
        <div className="bg-page/40 p-1 rounded-xl flex items-center border border-cardBorder">
          <button 
            type="button"
            className={`${switcherBtnBase} ${
              active === "signIn" 
                ? "bg-primary text-white shadow-md shadow-primary/25" 
                : "bg-transparent text-body hover:text-title"
            }`}
            onClick={() => setActive("signIn")}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`${switcherBtnBase} ${
              active === "signUp" 
                ? "bg-primary text-white shadow-md shadow-primary/25" 
                : "bg-transparent text-body hover:text-title"
            }`}
            onClick={() => setActive("signUp")}
          >
            Sign Up
          </button>
        </div>

        {/* Dynamic Header Titles using semantic text colors */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-title transition-all">
            {active === "signUp" ? "Create your account" : "Welcome Back"}
          </h2>
          <p className="mt-1.5 text-xs text-body">
            {active === "signUp" 
              ? "Join us today! Please enter your details." 
              : "Enter your credentials to access your account."}
          </p>
        </div>

        {/* Render Active Form Module */}
        <div className="mt-2">
          {active === "signIn" ? <Login /> : <Signup />}
        </div>

      </div>
    </div>
  );
}

export default Auth;