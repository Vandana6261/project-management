import React, { useState, useEffect, useRef } from "react";
import {
  CheckSquare,
  X,
  Calendar,
  AlignLeft,
  ShieldAlert,
  Users,
} from "lucide-react";
import {
  addTaskInProject,
  getProjectMembers,
  getTaskOptions,
} from "../api/projectApi";

const initialFormState = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  startDate: "",
  dueDate: "",
  projectId: "",
  members: [], // Array of assigned member IDs/objects
};

function AddTaskModal({ project, onClose, onTaskAdded }) {
  const [formData, setFormData] = useState({...initialFormState, projectId: project?.id});

  const [memberInput, setMemberInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [priorityOtions, setPriorityOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]); // Master list of project members
  const [memberToShow, setMemberToShow] = useState([]); // Filtered dropdown options
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [resError, setResError] = useState({});
  const [inputError, setInputError] = useState({});

  const dropdownRef = useRef(null);

  // Sync projectId if project prop changes
  useEffect(() => {
    if (project?.id) {
      setFormData((prev) => ({ ...prev, projectId: project.id }));
    }

    async function fetchOptions() {
      try {
        const [options, membersRes] = await Promise.all([
          getTaskOptions(),
          getProjectMembers(project.id),
        ]);

        setStatusOptions(options.data.status);
        setPriorityOptions(options.data.priority);

        // Assume membersRes.members returns the array of members
        const fetchedMembers = membersRes.members || [];
        setMemberOptions(fetchedMembers);
        setMemberToShow(fetchedMembers);

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

    fetchOptions();
  }, [project]);

  // Debounced search for members
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!memberInput.trim()) {
        setMemberToShow(memberOptions);
      } else {
        const query = memberInput.toLowerCase();
        const filtered = memberOptions.filter(
          (m) => m.username && m.username.toLowerCase().includes(query),
        );
        setMemberToShow(filtered);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [memberInput, memberOptions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputError({});
    setResError({});
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMember = (member) => {
    // Prevent duplicate selections
    if (!formData.members.some((m) => (m.id || m) === (member.id || member))) {
      setFormData((prev) => ({
        ...prev,
        members: [...prev.members, member],
      }));
    }
    setMemberInput("");
    setIsDropdownOpen(false);
  };

  const handleRemoveMember = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => (m.id || m) !== memberId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Automatically append default times: start of day for start date, end of day for due date
    const payload = {
      ...formData,
      members: formData.members.map((m) => m.id || m),
      startDate: formData.startDate
        ? new Date(`${formData.startDate}T00:00:00`).toISOString()
        : null,
      dueDate: formData.dueDate
        ? new Date(`${formData.dueDate}T23:59:59`).toISOString()
        : null,
    };

    try {
      // console.log(payload);
      const response = await addTaskInProject(payload);
      // if (onTaskAdded) onTaskAdded(response);
      console.log(response, "add Task Result");
      if (!response.success) {
        setResError({ message: response.message });
        return;
      }
      setFormData(initialFormState);
      onClose();
    } catch (err) {
      console.error("Failed to add task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-card border border-cardBorder p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
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

          {/* Assigned Members Input Field */}
          <div className="relative" ref={dropdownRef}>
            <label
              htmlFor="memberInput"
              className="text-[10px] uppercase font-bold tracking-widest text-muted mb-1.5 block"
            >
              Assign Members
            </label>

            <div className="w-full rounded-xl border border-inputBorder bg-inputBg p-2 flex flex-wrap items-center gap-1.5 focus-within:border-primary transition-colors">
              {/* Selected Member Chips */}
              {formData.members.map((member) => {
                const memberId = member.id || member;
                const memberObj = memberOptions.find(
                  (m) => (m.id || m) === memberId,
                ) || { username: member };
                return (
                  <span
                    key={memberId}
                    className="inline-flex items-center gap-1 bg-primary/15 text-primary text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                  >
                    @{memberObj.username || memberObj.name || memberId}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(memberId)}
                      className="hover:text-title transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}

              {/* Typing Search Input */}
              <input
                id="memberInput"
                type="text"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={
                  formData.members.length === 0
                    ? "Type to search members..."
                    : "Add more..."
                }
                className="flex-1 bg-transparent border-none py-1 px-1 text-xs text-title placeholder:text-placeholder focus:outline-none min-w-[120px]"
              />
            </div>

            {/* Filtered Dropdown Options */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-xl bg-card border border-cardBorder shadow-xl z-20">
                {memberToShow.length > 0 ? (
                  memberToShow.map((member) => {
                    const memberId = member.id || member;
                    const isSelected = formData.members.some(
                      (m) => (m.id || m) === memberId,
                    );
                    if (isSelected) return null;

                    return (
                      <div
                        key={memberId}
                        onClick={() => handleAddMember(member)}
                        className="px-3 py-2 text-xs text-title hover:bg-primary/10 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <span>@{member.username}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-3 py-2 text-xs text-muted text-center">
                    No members found
                  </div>
                )}
              </div>
            )}
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
                {statusOptions.length > 0 &&
                  statusOptions.map((status) => (
                    <option
                      key={status.value}
                      value={status.value}
                      className="bg-card"
                    >
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
                {priorityOtions.length > 0 &&
                  priorityOtions.map((priority) => (
                    <option
                      key={priority.value}
                      value={priority.value}
                      className="bg-card"
                    >
                      {priority.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Start Date & Due Date (Date Only) */}
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
                type="date"
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
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-inputBorder bg-inputBg py-2 px-3 text-xs text-title focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {resError?.message && (
            <p className="text-alert text-sm">{resError.message}</p>
          )}
          {inputError?.message && (
            <p className="text-alert text-sm">{inputError.message}</p>
          )}

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
