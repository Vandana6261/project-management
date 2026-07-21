import React, { useEffect, useState } from "react";
import { createProject, getOptions } from "../api/projectApi";

function ProjectForm() {
  const [statusOptions, setStatusOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);

  // Controlled form state matching your needed fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    priority: "",
    startDate: "",
    dueDate: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchOptions() {
      try {
        const options = await getOptions();
        setStatusOptions(options.data.status);
        setPriorityOptions(options.data.priority);
      } catch (error) {
        console.log(error);
      }
    }

    fetchOptions();
  }, []);

  // Centralized change handler tracking all input field types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error dynamically when the field is updated
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Dedicated validation runner ensuring rule matching for dates
  const validateForm = () => {
    let localErrors = {};
    const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    if (!formData.name.trim()) localErrors.name = "Project name is required.";
    if (!formData.description.trim()) localErrors.description = "Description is required.";
    if (!formData.status) localErrors.status = "Please select a status context.";
    if (!formData.priority) localErrors.priority = "Please assign a priority layer.";
    
    // Start date check: Must be present or future
    if (!formData.startDate) {
      localErrors.startDate = "Start date is required.";
    } else if (formData.startDate < todayStr) {
      localErrors.startDate = "Start date must be today or in the future.";
    }

    // Due date check: Optional, but if present must be greater than start date
    if (formData.dueDate && formData.startDate && formData.dueDate <= formData.startDate) {
      localErrors.dueDate = "Due date must be after the start date.";
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const res = await createProject(formData);
    console.log(await res.json());

    // Clear form state context completely following successful operation execution
    setFormData({
      name: "",
      description: "",
      status: "",
      priority: "",
      startDate: "",
      dueDate: "",
    });
    setErrors({});
  };

  // Reusable component class string generators matching standard layouts
  const inputBaseClass = "w-full rounded-xl border border-inputBorder bg-inputBg p-3 text-sm text-title placeholder:text-placeholder focus:border-primary focus:outline-none transition-colors duration-200";
  const labelClass = "text-[10px] uppercase font-bold tracking-widest text-muted mb-1.5 block";
  const errorClass = "text-alert text-xs mt-1 font-medium";

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-2xl bg-card border border-cardBorder shadow-xl backdrop-blur-md select-none">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold tracking-tight text-title">Initialize Project Engine</h2>
        <p className="text-xs text-muted mt-1">Configure foundational parameters to spawn your workspace container.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Project Name Field */}
        <div>
          <label htmlFor="name" className={labelClass}>Project Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Pulse Engine Architecture v2"
            className={inputBaseClass}
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        {/* Project Description Textarea Field */}
        <div>
          <label htmlFor="description" className={labelClass}>Project Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Outline structural milestones, technology stacks, and primary workspace objectives..."
            className={`${inputBaseClass} resize-none`}
          />
          {errors.description && <p className={errorClass}>{errors.description}</p>}
        </div>

        {/* Dual Column Container for Select Menus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status Dynamic Dropdown Selector */}
          <div>
            <label htmlFor="status" className={labelClass}>Engine Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`${inputBaseClass} appearance-none cursor-pointer`}
            >
              <option value="" disabled className="bg-card">Select Status Context</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-card text-title">
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.status && <p className={errorClass}>{errors.status}</p>}
          </div>

          {/* Priority Dynamic Dropdown Selector */}
          <div>
            <label htmlFor="priority" className={labelClass}>Velocity Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`${inputBaseClass} appearance-none cursor-pointer`}
            >
              <option value="" disabled className="bg-card">Select Vector Priority</option>
              {priorityOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-card text-title">
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.priority && <p className={errorClass}>{errors.priority}</p>}
          </div>
        </div>

        {/* Dual Column Container for Chrono Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start Date Field */}
          <div>
            <label htmlFor="startDate" className={labelClass}>Start Epoch Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={inputBaseClass}
            />
            {errors.startDate && <p className={errorClass}>{errors.startDate}</p>}
          </div>

          {/* Due Date Field */}
          <div>
            <label htmlFor="dueDate" className={labelClass}>Target Deadline (Optional)</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={inputBaseClass}
            />
            {errors.dueDate && <p className={errorClass}>{errors.dueDate}</p>}
          </div>
        </div>

        {/* Form Submission Actions Segment */}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primaryHover text-xs font-extrabold uppercase tracking-widest text-white py-3 px-6 shadow-md shadow-primary/15 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            Create Architecture Context
          </button>
        </div>

      </form>
    </div>
  );
}

export default ProjectForm;