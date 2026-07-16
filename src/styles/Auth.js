
// Premium glassmorphism form-fields adaptive to active theme variables
const inputBase = `block w-full bg-inputBg backdrop-blur-xl rounded-xl border border-inputBorder py-3 px-4 text-sm font-medium tracking-wide text-title placeholder-placeholder/50 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10`;

// Crisp, uppercase micro-labels with a clean modern tracking style
const label = `text-[10px] uppercase font-bold tracking-widest text-muted `;

// The matching password wrapper matching inputBase structure exactly
const passWordInput = `flex items-center w-full bg-inputBg backdrop-blur-xl rounded-xl border border-inputBorder transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10`;

// The inner raw input for password wrappers
const passWordInnerInput = `flex-1 bg-transparent py-3 px-4 text-sm font-medium tracking-wide text-title placeholder-placeholder/50 focus:outline-none`;

// Premium, high-contrast structural CTA buttons
const submitButton = `w-full mt-4 rounded-xl bg-primary py-3.5 text-xs uppercase font-extrabold tracking-widest text-white shadow-lg shadow-primary/15 hover:bg-primaryHover hover:shadow-primary/25 active:scale-[0.985] transition-all duration-200 cursor-pointer`;

export { inputBase, label, passWordInput, passWordInnerInput, submitButton };