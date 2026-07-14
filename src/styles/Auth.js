
// Premium dark-mode glassmorphism with dynamic focus accents
const inputBase = `block w-full bg-zinc-900/60 backdrop-blur-xl rounded-xl border border-white/10 py-3 px-4 text-sm text-zinc-100 placeholder-zinc-500 transition-all focus:border-[#07BAA5] focus:outline-none focus:ring-4 focus:ring-[#07BAA5]/10`;

// A clean, legible slate label
const label = `text-xs font-semibold tracking-wider text-zinc-400 mb-1.5`;

// The matching password wrapper matching inputBase structure exactly
const passWordInput = `flex items-center w-full bg-zinc-900/60 backdrop-blur-xl rounded-xl border border-white/10 transition-all focus-within:border-[#07BAA5] focus-within:ring-4 focus-within:ring-[#07BAA5]/10`;

export { inputBase, label, passWordInput };