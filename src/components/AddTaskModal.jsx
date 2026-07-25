// src/components/ui/AddTaskModal.jsx
import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  X,
  Calendar,
  AlignLeft,
  ShieldAlert,
  Users,
} from "lucide-react";
import { getProjectMembers, getTaskOptions } from "../api/projectApi";
// import { addTaskInProject } from "../api/projectApi"; // Ensure this function exists in your API helper

function AddTaskModal({ project, onClose, onTaskAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    startDate: "",
    dueDate: "",
    projectId: project?.id || "",
    members: [], // Array of assigned member IDs
  });

  const [memberInput, setMemberInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [priorityOtions, setPriorityOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [memberToShow, setMemberToShow] = useState([]);

  const projectId = project.projectId;

  // Sync projectId if project prop changes
  useEffect(() => {
    if (project?.id) {
      setFormData((prev) => ({ ...prev, projectId: project.id }));
    }

    async function fetchOptions() {
      try {
        const [options, memberOptions] = await Promise.all([
          getTaskOptions(),
          getProjectMembers(project.id)
        ])
        
        setStatusOptions(options.data.status);
        setPriorityOptions(options.data.priority);

        if (options.data.status.length > 0) {
          setFormData((prev) => ({
            ...prev,
            status: options.data.status[0].value,
            priority: options.data.priority[0].value,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchOptions()
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multi-select or single assign member toggle
  const handleMemberChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setFormData((prev) => ({ ...prev, members: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format ISO Dates if filled out
    const payload = {
      ...formData,
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : null,
      dueDate: formData.dueDate
        ? new Date(formData.dueDate).toISOString()
        : null,
    };

    try {
      // const response = await addTaskInProject(payload);
      // if (onTaskAdded) onTaskAdded(response);
      // onClose();
    } catch (err) {
      console.error("Failed to add task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-card border border-cardBorder p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-title p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-title">
              Create New Task
            </h3>
            <p className="text-xs text-muted">Project: {project?.name}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="text"
              className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1.5 block"
            >
              Task Title *
            </label>
            <input
              id="text"
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Create Payment API"
              className="w-full rounded-xl border border-inputBorder bg-inputBg py-2.5 px-3.5 text-xs text-title placeholder:text-placeholder focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1.5 block"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Integrate payment gateway and handle payment flow..."
              className="w-full rounded-xl border border-inputBorder bg-inputBg py-2 px-3 text-xs text-title placeholder:text-placeholder focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="status"
                className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1.5 block"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-inputBorder bg-inputBg py-2.5 px-3 text-xs text-title focus:border-primary focus:outline-none transition-colors cursor-pointer"
              >
                {statusOptions.length && statusOptions.map((status) => (
                <option value={status.value} className="bg-card">
                  {status.label}
                </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1.5 block"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-inputBorder bg-inputBg py-2.5 px-3 text-xs text-title focus:border-primary focus:outline-none transition-colors cursor-pointer"
              >
                {priorityOtions.length && priorityOtions.map((priority) => (
                <option value={priority.value} className="bg-card">
                  {priority.label}
                </option>
                ))}
              </select>
            </div>
          </div>

          {/* Start Date & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="startDate"
                className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1.5 block"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-inputBorder bg-inputBg py-2 px-3 text-xs text-title focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1.5 block"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-inputBorder bg-inputBg py-2 px-3 text-xs text-title focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-cardBorder">
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
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primaryHover text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;
