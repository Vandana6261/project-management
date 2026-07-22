// src/components/ui/AddMemberModal.jsx
import React, { useState } from "react";
import { UserPlus, X, Mail, Shield } from "lucide-react";

function AddMemberModal({ project, onClose }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("developer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Replace with your API call e.g., addProjectMember(project.id, { email, role })
      console.log(`Adding ${email} as ${role} to project ${project.id}`);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-cardBorder p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-title p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-title">Add Team Member</h3>
            <p className="text-xs text-muted">Project: {project.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1.5 block">
              Member Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-placeholder absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full rounded-xl border border-inputBorder bg-inputBg py-2.5 pl-10 pr-3 text-xs text-title placeholder:text-placeholder focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1.5 block">
              Assign Role
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 text-placeholder absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-inputBorder bg-inputBg py-2.5 pl-10 pr-3 text-xs text-title focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="developer" className="bg-card">Developer</option>
                <option value="admin" className="bg-card">Admin</option>
                <option value="viewer" className="bg-card">Viewer</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-muted hover:text-title transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primaryHover text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              {isSubmitting ? "Inviting..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMemberModal;