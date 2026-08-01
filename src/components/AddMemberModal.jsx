// src/components/ui/AddMemberModal.jsx
import React, { useEffect, useState } from "react";
import { UserPlus, X, Mail, Shield } from "lucide-react";
import { addMemberInProject, getOptions } from "../api/projectApi";

function AddMemberModal({ project, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [formData, setFormData] = useState({
    projectId: project.id,
    email: "",
    role: roleOptions[0] || "",
  });
  const [resError, setResError] = useState({});
  const [inputError, setInputError] = useState({});


  const handleChange = (e) => {
    setResError({});
    setInputError({});
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error dynamically when the field is updated
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.role) {
      setInputError.message = "Please fill all of the field"
      return;
    }
    setIsSubmitting(true);
    console.log(formData);
    try {
      // console.log(formData, "formData");
      const response = await addMemberInProject(formData);
      console.log(response);
      if (!response.success) {
        setResError({ message: response.message });
        return;
      }
      console.log(response);
      
      setFormData({
        projectId: project.id,
        email: "",
        role: roleOptions[0] || "",
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchOptions() {
      try {
        const options = await getOptions();
        
        setRoleOptions(options.data.roles);

        if (options.data.roles.length > 0) {
          setFormData((prev) => ({
            ...prev,
            role: options.data.roles[0].value,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchOptions();
  }, []);


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
            <h3 className="text-base font-extrabold text-title">
              Add Team Member
            </h3>
            <p className="text-xs text-muted">Project: {project.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1.5 block"
            >
              Member Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-placeholder absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="colleague@company.com"
                className="w-full rounded-xl border border-inputBorder bg-inputBg py-2.5 pl-10 pr-3 text-xs text-title placeholder:text-placeholder focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1.5 block"
            >
              Assign Role
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 text-placeholder absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                name="role"
                className="w-full rounded-xl border border-inputBorder bg-inputBg py-2.5 pl-10 pr-3 text-xs text-title focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                {roleOptions.map((role) => (
                  <option
                    key={role.label}
                    value={role.value}
                    className="bg-card"
                  >
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {inputError?.message && (
            <p className="text-alert text-sm">{inputError.message}</p>
          )}

          {resError?.message && (
            <p className="text-alert text-sm">{resError.message}</p>
          )}

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
              {isSubmitting ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMemberModal;
