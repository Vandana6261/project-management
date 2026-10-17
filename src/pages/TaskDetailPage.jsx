import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  ArrowLeft,
  CircleDot,
  CheckCircle2,
  Clock,
  GitPullRequest,
  CircleDashed,
  XCircle,
  Calendar,
  Users,
  UserPlus,
  Tag,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  FileText,
  AlertCircle,
  FolderKanban,
  Sparkles,
  Layers,
  CheckSquare,
} from "lucide-react";
import {
  STATUS_CONFIG,
  ORDERED_STATUSES,
  PRIORITY_CONFIG,
  formatDate,
  getAvatarColor,
  parseTaskContent,
  serializeTaskContent,
} from "../utils/taskUtils";
import { getTaskById, updateTask, invalidateProjectCache } from "../services/projectApi";

function TaskDetailPage() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const context = useOutletContext();
  const projectData = context?.projectData || context?.project;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editable sections
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descInput, setDescInput] = useState("");

  const [isEditingReasons, setIsEditingReasons] = useState(false);
  const [reasonsInput, setReasonsInput] = useState("");

  const [isEditingCriteria, setIsEditingCriteria] = useState(false);
  const [criteriaInput, setCriteriaInput] = useState("");

  // Custom fields: key-value pairs
  const [customFields, setCustomFields] = useState({});
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [isAddingField, setIsAddingField] = useState(false);

  // Assignee Popover
  const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");

  // Load task details
  useEffect(() => {
    let isMounted = true;
    async function loadTask() {
      setLoading(true);
      setError(null);

      // Check if task exists in outlet context first
      if (projectData?.tasks) {
        const found = projectData.tasks.find((t) => t.id === taskId);
        if (found) {
          initTask(found);
          setLoading(false);
          return;
        }
      }

      // Fallback: fetch from API
      try {
        const res = await getTaskById(taskId);
        if (isMounted) {
          if (res?.success && res.data) {
            initTask(res.data);
          } else {
            setError(res?.message || "Task not found");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load task details");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTask();
    return () => {
      isMounted = false;
    };
  }, [taskId, projectData]);

  const initTask = (data) => {
    setTask(data);
    setTitleInput(data.title || "");

    const parsed = parseTaskContent(data.description || "");
    setDescInput(parsed.description || "");
    setReasonsInput(parsed.reasons || "");
    setCriteriaInput(parsed.criteria || "");
    setCustomFields(parsed.customFields || {});
  };

  const notifySaveSuccess = (msg = "Saved successfully") => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(""), 2500);
  };

  // Generic updater
  const handleSaveField = async (updatePayload) => {
    setIsSaving(true);
    try {
      const res = await updateTask(taskId, updatePayload, projectId);
      if (res?.success && res.data) {
        setTask((prev) => ({ ...prev, ...res.data }));
      } else {
        // Fallback optimistic
        setTask((prev) => ({ ...prev, ...updatePayload }));
      }
      invalidateProjectCache(projectId);
      notifySaveSuccess();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save changes: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  // Save Title
  const handleSaveTitle = async () => {
    if (!titleInput.trim()) return;
    await handleSaveField({ title: titleInput.trim() });
    setIsEditingTitle(false);
  };

  // Save composite content (Description, Reasons, Criteria, Custom Fields)
  const saveCompositeContent = async (newDesc, newReasons, newCriteria, newCustom) => {
    const serialized = serializeTaskContent({
      description: newDesc,
      reasons: newReasons,
      criteria: newCriteria,
      customFields: newCustom,
    });
    await handleSaveField({ description: serialized });
  };

  // Save Description
  const handleSaveDescription = async () => {
    await saveCompositeContent(descInput, reasonsInput, criteriaInput, customFields);
    setIsEditingDesc(false);
  };

  // Save Reasons
  const handleSaveReasons = async () => {
    await saveCompositeContent(descInput, reasonsInput, criteriaInput, customFields);
    setIsEditingReasons(false);
  };

  // Save Criteria
  const handleSaveCriteria = async () => {
    await saveCompositeContent(descInput, reasonsInput, criteriaInput, customFields);
    setIsEditingCriteria(false);
  };

  // Add Custom Field
  const handleAddCustomField = async (e) => {
    e.preventDefault();
    if (!newFieldKey.trim()) return;
    const updated = {
      ...customFields,
      [newFieldKey.trim()]: newFieldValue.trim(),
    };
    setCustomFields(updated);
    setNewFieldKey("");
    setNewFieldValue("");
    setIsAddingField(false);
    await saveCompositeContent(descInput, reasonsInput, criteriaInput, updated);
  };

  // Delete Custom Field
  const handleDeleteCustomField = async (keyToDelete) => {
    const updated = { ...customFields };
    delete updated[keyToDelete];
    setCustomFields(updated);
    await saveCompositeContent(descInput, reasonsInput, criteriaInput, updated);
  };

  // Toggle member assignment
  const handleToggleMember = async (userId) => {
    const currentMemberIds = (task.assignments || []).map(
      (a) => a.user?.id || a.userId
    );
    let newMemberIds = [];

    if (currentMemberIds.includes(userId)) {
      newMemberIds = currentMemberIds.filter((id) => id !== userId);
    } else {
      newMemberIds = [...currentMemberIds, userId];
    }

    const projectMembers = projectData?.members || [];
    const newAssignments = newMemberIds.map((uid) => {
      const pm = projectMembers.find((m) => m.user?.id === uid);
      return {
        user: pm?.user || { id: uid, fullName: "User", username: "user" },
        assignedAt: new Date().toISOString(),
      };
    });

    setTask((prev) => ({ ...prev, assignments: newAssignments }));
    await handleSaveField({ members: newMemberIds });
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-muted">
        <Clock className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm">Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-8 bg-card border border-cardBorder rounded-2xl text-center space-y-4 max-w-lg mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-alert mx-auto" />
        <h2 className="text-lg font-bold text-title">Task Not Found</h2>
        <p className="text-xs text-muted">
          {error || "Could not find task details. It may have been moved or deleted."}
        </p>
        <Link
          to={`/workspace/${projectId}/tasks`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primaryHover transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to All Tasks</span>
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;
  const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
  const assignments = task.assignments || [];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Breadcrumb & Notification */}
      <div className="flex items-center justify-between">
        <Link
          to={`/workspace/${projectId}/tasks`}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors py-1 px-2.5 rounded-lg hover:bg-inputBg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tasks</span>
        </Link>

        {saveSuccessMessage && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            {saveSuccessMessage}
          </span>
        )}
      </div>

      {/* Hero Task Header (GitHub Issue Header Style) */}
      <div className="bg-card border border-cardBorder rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            {/* Title Row */}
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="flex-1 text-xl sm:text-2xl font-black text-title bg-inputBg border border-primary px-3 py-1.5 rounded-xl focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveTitle}
                  disabled={isSaving}
                  className="p-2 rounded-xl bg-primary text-white hover:bg-primaryHover transition-colors cursor-pointer"
                  title="Save title"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setTitleInput(task.title);
                    setIsEditingTitle(false);
                  }}
                  className="p-2 rounded-xl bg-inputBg border border-inputBorder text-muted hover:text-title transition-colors"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 group">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-title tracking-tight">
                  {task.title}
                </h1>
                <span className="text-muted font-mono text-base font-medium">
                  #{task.id?.slice(-5) || "task"}
                </span>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-inputBg text-muted hover:text-primary transition-all"
                  title="Edit title"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Status & Issue Meta Pill Bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.badgeClass}`}
              >
                <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
                {statusConfig.label}
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${priorityConfig.badgeClass}`}
              >
                {task.priority} Priority
              </span>

              <span className="text-muted">
                Project:{" "}
                <strong className="text-title font-semibold">
                  {task.project?.name || projectData?.name || "Workspace"}
                </strong>
              </span>

              <span className="text-muted">
                Created:{" "}
                <span className="text-title">{formatDate(task.createdAt)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid (GitHub Issue Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Content Boxes: Description, Reasons, Criteria, Future Fields) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. DESCRIPTION BOX */}
          <div className="bg-card border border-cardBorder rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-cardBorder bg-inputBg/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-extrabold text-title uppercase tracking-wider">
                  Description
                </h3>
              </div>
              {!isEditingDesc && (
                <button
                  onClick={() => setIsEditingDesc(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors font-semibold px-2 py-1 rounded hover:bg-inputBg"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <div className="p-5">
              {isEditingDesc ? (
                <div className="space-y-3">
                  <textarea
                    rows={5}
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    placeholder="Provide a detailed description of what this task accomplishes..."
                    className="w-full rounded-xl border border-inputBorder bg-inputBg p-3 text-xs text-title focus:border-primary focus:outline-none transition-colors"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        const parsed = parseTaskContent(task.description);
                        setDescInput(parsed.description);
                        setIsEditingDesc(false);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-muted hover:text-title hover:bg-inputBg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveDescription}
                      disabled={isSaving}
                      className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primaryHover text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Save Description
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-body leading-relaxed whitespace-pre-wrap">
                  {descInput ? (
                    descInput
                  ) : (
                    <p className="text-muted italic">
                      No description provided for this task. Click Edit to add one.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 2. REASONS & BUSINESS CONTEXT BOX */}
          <div className="bg-card border border-cardBorder rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-cardBorder bg-inputBg/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                <h3 className="text-xs font-extrabold text-title uppercase tracking-wider">
                  Reasons & Context
                </h3>
              </div>
              {!isEditingReasons && (
                <button
                  onClick={() => setIsEditingReasons(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-secondary transition-colors font-semibold px-2 py-1 rounded hover:bg-inputBg"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <div className="p-5">
              {isEditingReasons ? (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={reasonsInput}
                    onChange={(e) => setReasonsInput(e.target.value)}
                    placeholder="Why is this task needed? Explain the business motivation, customer issue, or technical rationale..."
                    className="w-full rounded-xl border border-inputBorder bg-inputBg p-3 text-xs text-title focus:border-secondary focus:outline-none transition-colors"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        const parsed = parseTaskContent(task.description);
                        setReasonsInput(parsed.reasons);
                        setIsEditingReasons(false);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-muted hover:text-title hover:bg-inputBg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveReasons}
                      disabled={isSaving}
                      className="px-4 py-1.5 rounded-xl bg-secondary hover:bg-secondaryHover text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Save Reasons
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-body leading-relaxed whitespace-pre-wrap">
                  {reasonsInput ? (
                    reasonsInput
                  ) : (
                    <p className="text-muted italic">
                      No reasons or justification specified. Click Edit to document the reasoning behind this task.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 3. ACCEPTANCE CRITERIA BOX */}
          <div className="bg-card border border-cardBorder rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-cardBorder bg-inputBg/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-extrabold text-title uppercase tracking-wider">
                  Acceptance Criteria
                </h3>
              </div>
              {!isEditingCriteria && (
                <button
                  onClick={() => setIsEditingCriteria(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-emerald-400 transition-colors font-semibold px-2 py-1 rounded hover:bg-inputBg"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <div className="p-5">
              {isEditingCriteria ? (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={criteriaInput}
                    onChange={(e) => setCriteriaInput(e.target.value)}
                    placeholder="- [ ] API endpoint returns 200 OK&#10;- [ ] Unit tests pass&#10;- [ ] Reviewed by team lead"
                    className="w-full rounded-xl border border-inputBorder bg-inputBg p-3 text-xs text-title focus:border-emerald-400 focus:outline-none transition-colors"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        const parsed = parseTaskContent(task.description);
                        setCriteriaInput(parsed.criteria);
                        setIsEditingCriteria(false);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-muted hover:text-title hover:bg-inputBg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveCriteria}
                      disabled={isSaving}
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Save Criteria
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-body leading-relaxed whitespace-pre-wrap">
                  {criteriaInput ? (
                    criteriaInput
                  ) : (
                    <p className="text-muted italic">
                      No criteria defined yet. Click Edit to add measurable conditions for completion.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 4. EXTENSIBLE CUSTOM FIELDS ("some more field if I want it in future") */}
          <div className="bg-card border border-cardBorder rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-cardBorder bg-inputBg/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-extrabold text-title uppercase tracking-wider">
                  Custom & Future Fields
                </h3>
              </div>
              <button
                onClick={() => setIsAddingField(!isAddingField)}
                className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Field</span>
              </button>
            </div>

            <div className="p-5 space-y-4">
              {isAddingField && (
                <form
                  onSubmit={handleAddCustomField}
                  className="p-3 rounded-xl bg-inputBg border border-inputBorder space-y-3 animate-fadeIn"
                >
                  <p className="text-[11px] font-bold text-title">New Custom Attribute</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Field Name (e.g. Sprint, Branch, Blocker)"
                      value={newFieldKey}
                      onChange={(e) => setNewFieldKey(e.target.value)}
                      required
                      className="px-3 py-1.5 rounded-lg border border-inputBorder bg-card text-xs text-title focus:border-primary focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Field Value (e.g. Sprint 4, feat/auth)"
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      required
                      className="px-3 py-1.5 rounded-lg border border-inputBorder bg-card text-xs text-title focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingField(false)}
                      className="px-3 py-1 rounded-lg text-xs text-muted hover:text-title"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-primary text-white text-xs font-bold"
                    >
                      Save Field
                    </button>
                  </div>
                </form>
              )}

              {Object.keys(customFields).length === 0 ? (
                <p className="text-xs text-muted italic">
                  No custom fields defined yet. You can add any extra fields you need in the future (e.g. Sprint, Release, Blockers, PR links).
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(customFields).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-xl bg-inputBg border border-inputBorder group"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="block text-[10px] uppercase font-bold tracking-wider text-muted">
                          {key}
                        </span>
                        <span className="block text-xs font-semibold text-title truncate mt-0.5">
                          {String(value)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteCustomField(key)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-alert transition-all"
                        title="Delete field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar (GitHub Projects / Issue Metadata Sidebar) */}
        <div className="space-y-5">
          {/* Status Field */}
          <div className="bg-card border border-cardBorder rounded-2xl p-5 shadow-sm space-y-3">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted block">
              Status
            </label>
            <div className="relative">
              <select
                value={task.status}
                onChange={(e) => handleSaveField({ status: e.target.value })}
                className="w-full appearance-none rounded-xl border border-inputBorder bg-inputBg py-2.5 pl-3.5 pr-8 text-xs font-bold text-title focus:border-primary focus:outline-none cursor-pointer"
              >
                {ORDERED_STATUSES.map((st) => (
                  <option key={st} value={st} className="bg-card text-title">
                    {STATUS_CONFIG[st]?.label || st}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Assignees Field (Multi-Member Support) */}
          <div className="bg-card border border-cardBorder rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold tracking-widest text-muted">
                Assignees ({assignments.length})
              </label>
              <button
                onClick={() => setIsAssigneePopoverOpen(!isAssigneePopoverOpen)}
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Manage</span>
              </button>
            </div>

            {/* List of current assignees */}
            <div className="space-y-2">
              {assignments.length === 0 ? (
                <p className="text-xs text-muted italic">No one assigned</p>
              ) : (
                assignments.map((assignment, idx) => {
                  const u = assignment.user || {};
                  const name = u.fullName || u.username || "User";
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-inputBg border border-inputBorder text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${getAvatarColor(
                            name
                          )}`}
                        >
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-title leading-tight truncate">
                            {u.fullName || u.username}
                          </p>
                          <p className="text-[10px] text-muted leading-tight">
                            @{u.username}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleMember(u.id)}
                        className="text-muted hover:text-alert p-1"
                        title="Remove assignee"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Manage Assignees Popover */}
            {isAssigneePopoverOpen && (
              <div className="pt-2 border-t border-cardBorder space-y-1 animate-fadeIn">
                <p className="text-[10px] uppercase font-bold text-muted mb-2">
                  Project Members
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {(projectData?.members || []).map((m) => {
                    const u = m.user || {};
                    const isAssigned = assignments.some(
                      (a) => (a.user?.id || a.userId) === u.id
                    );
                    return (
                      <div
                        key={u.id}
                        onClick={() => handleToggleMember(u.id)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          isAssigned
                            ? "bg-primary/15 text-primary font-bold"
                            : "hover:bg-inputBg text-title"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border ${getAvatarColor(
                              u.fullName || u.username
                            )}`}
                          >
                            {(u.fullName || u.username || "U").charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate">{u.fullName || u.username}</span>
                        </div>
                        {isAssigned && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Priority Field */}
          <div className="bg-card border border-cardBorder rounded-2xl p-5 shadow-sm space-y-3">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted block">
              Priority
            </label>
            <div className="relative">
              <select
                value={task.priority}
                onChange={(e) => handleSaveField({ priority: e.target.value })}
                className="w-full appearance-none rounded-xl border border-inputBorder bg-inputBg py-2.5 pl-3.5 pr-8 text-xs font-bold text-title focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              <ChevronDown className="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Timeline / Dates Field */}
          <div className="bg-card border border-cardBorder rounded-2xl p-5 shadow-sm space-y-4">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted block">
              Dates & Schedule
            </label>

            <div>
              <span className="text-[11px] text-muted block mb-1">Start Date</span>
              <input
                type="date"
                value={task.startDate ? task.startDate.split("T")[0] : ""}
                onChange={(e) =>
                  handleSaveField({
                    startDate: e.target.value
                      ? new Date(`${e.target.value}T00:00:00`).toISOString()
                      : null,
                  })
                }
                className="w-full rounded-xl border border-inputBorder bg-inputBg py-2 px-3 text-xs text-title focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <span className="text-[11px] text-muted block mb-1">Due Date</span>
              <input
                type="date"
                value={task.dueDate ? task.dueDate.split("T")[0] : ""}
                onChange={(e) =>
                  handleSaveField({
                    dueDate: e.target.value
                      ? new Date(`${e.target.value}T23:59:59`).toISOString()
                      : null,
                  })
                }
                className="w-full rounded-xl border border-inputBorder bg-inputBg py-2 px-3 text-xs text-title focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailPage;
