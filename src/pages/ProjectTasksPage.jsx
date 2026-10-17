import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  CircleDot,
  CheckCircle2,
  Clock,
  GitPullRequest,
  CircleDashed,
  XCircle,
  Plus,
  Search,
  Filter,
  Columns3,
  Table as TableIcon,
  ChevronDown,
  Calendar,
  Users,
  UserPlus,
  RefreshCw,
  ExternalLink,
  Tag,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import {
  STATUS_CONFIG,
  ORDERED_STATUSES,
  PRIORITY_CONFIG,
  formatDate,
  getAvatarColor,
} from "../utils/taskUtils";
import { updateTask, getProjectInfo, invalidateProjectCache } from "../services/projectApi";
import AddTaskModal from "../components/AddTaskModal";

function ProjectTasksPage({ filterAssignedOnly = false }) {
  const { projectId } = useParams();
  const context = useOutletContext();
  const navigate = useNavigate();

  const projectData = context?.projectData || context?.project;
  
  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState("table"); // "table" or "board"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("ALL");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [prefilledStatus, setPrefilledStatus] = useState("BACKLOG");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Quick Assign Popover State: taskId currently editing assignees
  const [assigningTaskId, setAssigningTaskId] = useState(null);
  const assignPopoverRef = useRef(null);

  // Sync tasks from context or projectData
  useEffect(() => {
    if (projectData?.tasks) {
      setTasks(projectData.tasks);
    }
  }, [projectData?.tasks]);

  // Handle outside click for assignee popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (assignPopoverRef.current && !assignPopoverRef.current.contains(event.target)) {
        setAssigningTaskId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      invalidateProjectCache(projectId);
      const res = await getProjectInfo(projectId, true);
      if (res?.data?.tasks) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error("Failed to refresh tasks:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Helper to update a task status locally and via API
  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTask(taskId, { status: newStatus }, projectId);
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Revert on error
      handleRefresh();
    }
  };

  // Helper to toggle a member assignment
  const handleToggleMember = async (task, userId) => {
    const currentMemberIds = (task.assignments || []).map(
      (a) => a.user?.id || a.userId
    );
    let newMemberIds = [];

    if (currentMemberIds.includes(userId)) {
      newMemberIds = currentMemberIds.filter((id) => id !== userId);
    } else {
      newMemberIds = [...currentMemberIds, userId];
    }

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== task.id) return t;
        const projectMembers = projectData?.members || [];
        const newAssignments = newMemberIds.map((uid) => {
          const pm = projectMembers.find((m) => m.user?.id === uid);
          return {
            user: pm?.user || { id: uid, fullName: "User", username: "user" },
            assignedAt: new Date().toISOString(),
          };
        });
        return { ...t, assignments: newAssignments };
      })
    );

    try {
      await updateTask(task.id, { members: newMemberIds }, projectId);
    } catch (err) {
      console.error("Failed to update task assignees:", err);
      handleRefresh();
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesAssignee = task.assignments?.some(
          (a) =>
            a.user?.fullName?.toLowerCase().includes(query) ||
            a.user?.username?.toLowerCase().includes(query)
        );
        if (!matchesTitle && !matchesDesc && !matchesAssignee) return false;
      }

      // Filter by status
      if (selectedStatusFilter !== "ALL" && task.status !== selectedStatusFilter) {
        return false;
      }

      // Filter by priority
      if (
        selectedPriorityFilter !== "ALL" &&
        task.priority !== selectedPriorityFilter
      ) {
        return false; 
      }

      return true;
    });
  }, [tasks, searchQuery, selectedStatusFilter, selectedPriorityFilter]);

  // Tasks grouped by status for Board View
  const tasksByStatus = useMemo(() => {
    const map = {
      BACKLOG: [],
      TODO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      DONE: [],
      CANCELLED: [],
    };
    filteredTasks.forEach((task) => {
      const statusKey = task.status || "TODO";
      if (map[statusKey]) {
        map[statusKey].push(task);
      } else {
        map.TODO.push(task);
      }
    });
    return map;
  }, [filteredTasks]);

  const getStatusIcon = (statusKey) => {
    switch (statusKey) {
      case "BACKLOG":
        return <CircleDashed className="w-3.5 h-3.5 text-zinc-400" />;
      case "TODO":
        return <CircleDot className="w-3.5 h-3.5 text-sky-400" />;
      case "IN_PROGRESS":
        return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      case "IN_REVIEW":
        return <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />;
      case "DONE":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case "CANCELLED":
        return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <CircleDot className="w-3.5 h-3.5 text-muted" />;
    }
  };

  const openAddTask = (status = "BACKLOG") => {
    setPrefilledStatus(status);
    setIsAddTaskModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* GitHub Projects Style Header */}
      <div className="bg-card border border-cardBorder rounded-2xl p-5 shadow-sm space-y-4">
        {/* Top bar with Breadcrumb & Primary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted font-medium">
              <Link
                to={`/workspace/${projectId}`}
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <span>{projectData?.name || "Project"}</span>
              </Link>
              <span>/</span>
              <span className="text-title font-semibold">GitHub Project Board</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-title tracking-tight flex items-center gap-2.5">
                <Columns3 className="w-6 h-6 text-primary" />
                <span>All Tasks</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {tasks.length} items
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh project data"
              className="p-2 rounded-xl bg-inputBg border border-inputBorder text-muted hover:text-title hover:border-primary/40 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            </button>

            <button
              onClick={() => openAddTask("BACKLOG")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primaryHover text-white text-xs font-bold shadow-md shadow-primary/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Views Switcher & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-cardBorder">
          {/* View Mode Tabs (GitHub Projects Style: Table vs Board) */}
          <div className="flex items-center bg-inputBg p-1 rounded-xl border border-inputBorder w-fit">
            <button
              onClick={() => setActiveView("table")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === "table"
                  ? "bg-card text-title shadow-sm border border-cardBorder"
                  : "text-muted hover:text-title"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 text-primary" />
              <span>Table</span>
              <span className="text-[10px] bg-inputBg px-1.5 py-0.2 rounded font-mono text-muted">
                {filteredTasks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveView("board")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === "board"
                  ? "bg-card text-title shadow-sm border border-cardBorder"
                  : "text-muted hover:text-title"
              }`}
            >
              <Columns3 className="w-3.5 h-3.5 text-primary" />
              <span>Board</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by title or assignee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-inputBorder bg-inputBg text-xs text-title placeholder:text-placeholder focus:border-primary focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-title"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-inputBorder bg-inputBg text-xs text-title focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {ORDERED_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {STATUS_CONFIG[st]?.label || st}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-inputBorder bg-inputBg text-xs text-title focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW CONTENT */}
      {activeView === "table" ? (
        /* ======================== GITHUB PROJECTS TABLE VIEW ======================== */
        <div className="bg-card border border-cardBorder rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cardBorder bg-inputBg/40 text-[11px] uppercase tracking-wider font-extrabold text-muted">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 min-w-[280px] max-w-[420px]">
                    Heading / Title
                  </th>
                  <th className="py-3 px-4 w-44">Status</th>
                  <th className="py-3 px-4 w-52">Assignees</th>
                  <th className="py-3 px-4 w-32">Priority</th>
                  <th className="py-3 px-4 w-32">Due Date</th>
                  <th className="py-3 px-4 w-20 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cardBorder text-xs">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CircleDot className="w-8 h-8 text-muted/50" />
                        <p className="font-semibold text-sm">No tasks found matching criteria</p>
                        <button
                          onClick={() => openAddTask("BACKLOG")}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Create a new task
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task, index) => {
                    const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;
                    const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
                    const assignments = task.assignments || [];

                    return (
                      <tr
                        key={task.id}
                        className="hover:bg-inputBg/50 transition-colors group"
                      >
                        {/* Index / ID Column */}
                        <td className="py-3 px-4 text-center text-muted font-mono text-[11px]">
                          #{index + 1}
                        </td>

                        {/* 1. Heading / Title (Truncated if taking more space than fixed) */}
                        <td className="py-3 px-4 min-w-[280px] max-w-[420px]">
                          <div className="flex items-center gap-2.5">
                            <span className="shrink-0">
                              {getStatusIcon(task.status)}
                            </span>
                            <div className="min-w-0 flex-1">
                              {/* Clickable link to detailed task page */}
                              <Link
                                to={`/workspace/${projectId}/tasks/${task.id}`}
                                title={task.title}
                                className="block font-semibold text-title hover:text-primary transition-colors truncate max-w-[260px] sm:max-w-[340px] md:max-w-[380px]"
                              >
                                {task.title}
                              </Link>
                              {task.description && (
                                <p
                                  title={task.description}
                                  className="text-[11px] text-muted truncate max-w-[260px] sm:max-w-[340px]"
                                >
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. Status (Interactive Dropdown / Badge) */}
                        <td className="py-3 px-4">
                          <div className="relative inline-block">
                            <select
                              value={task.status || "TODO"}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              className={`appearance-none cursor-pointer pl-6 pr-6 py-1 rounded-lg border text-[11px] font-bold transition-all focus:outline-none ${statusConfig.badgeClass}`}
                            >
                              {ORDERED_STATUSES.map((st) => (
                                <option
                                  key={st}
                                  value={st}
                                  className="bg-card text-title font-medium"
                                >
                                  {STATUS_CONFIG[st]?.label || st}
                                </option>
                              ))}
                            </select>
                            <span
                              className={`absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${statusConfig.dotClass}`}
                            />
                            <ChevronDown className="w-3 h-3 text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </td>

                        {/* 3. Assignees (Supports more than 1 member) */}
                        <td className="py-3 px-4">
                          <div className="relative">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {assignments.length === 0 ? (
                                <button
                                  onClick={() =>
                                    setAssigningTaskId(
                                      assigningTaskId === task.id ? null : task.id
                                    )
                                  }
                                  className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-primary px-2 py-0.5 rounded-md hover:bg-inputBg transition-colors"
                                >
                                  <UserPlus className="w-3 h-3" />
                                  <span>Assign</span>
                                </button>
                              ) : (
                                <div
                                  onClick={() =>
                                    setAssigningTaskId(
                                      assigningTaskId === task.id ? null : task.id
                                    )
                                  }
                                  className="flex items-center -space-x-1.5 cursor-pointer hover:opacity-85 transition-opacity"
                                  title={assignments
                                    .map((a) => a.user?.fullName || a.user?.username)
                                    .join(", ")}
                                >
                                  {assignments.map((assignment, aIdx) => {
                                    const u = assignment.user || {};
                                    const name = u.fullName || u.username || "U";
                                    const initial = name.charAt(0).toUpperCase();
                                    return (
                                      <div
                                        key={aIdx}
                                        className={`w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold ${getAvatarColor(
                                          name
                                        )}`}
                                        title={`@${u.username} (${u.fullName})`}
                                      >
                                        {initial}
                                      </div>
                                    );
                                  })}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAssigningTaskId(
                                        assigningTaskId === task.id ? null : task.id
                                      );
                                    }}
                                    className="w-6 h-6 rounded-full bg-inputBg border-2 border-card flex items-center justify-center text-[10px] text-muted hover:text-primary transition-colors"
                                    title="Add / Remove Assignees"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Quick Assign Dropdown Popover */}
                            {assigningTaskId === task.id && (
                              <div
                                ref={assignPopoverRef}
                                className="absolute left-0 mt-2 z-30 w-56 rounded-xl bg-card border border-cardBorder shadow-2xl p-2.5 space-y-1 animate-scale-in"
                              >
                                <div className="flex items-center justify-between pb-1.5 border-b border-cardBorder mb-1 px-1">
                                  <span className="text-[10px] uppercase font-bold text-muted">
                                    Assign Members
                                  </span>
                                  <button
                                    onClick={() => setAssigningTaskId(null)}
                                    className="text-muted hover:text-title"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="max-h-44 overflow-y-auto space-y-1">
                                  {(projectData?.members || []).map((m) => {
                                    const u = m.user || {};
                                    const isAssigned = assignments.some(
                                      (a) => (a.user?.id || a.userId) === u.id
                                    );
                                    return (
                                      <div
                                        key={u.id}
                                        onClick={() => handleToggleMember(task, u.id)}
                                        className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                          isAssigned
                                            ? "bg-primary/10 text-primary font-semibold"
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
                                          <span className="truncate">@{u.username}</span>
                                        </div>
                                        {isAssigned && <Check className="w-3.5 h-3.5 shrink-0" />}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Priority */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${priorityConfig.badgeClass}`}
                          >
                            {task.priority || "MEDIUM"}
                          </span>
                        </td>

                        {/* Due Date */}
                        <td className="py-3 px-4 text-muted text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-muted" />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        </td>

                        {/* Open Detailed View Link */}
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/workspace/${projectId}/tasks/${task.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-muted hover:text-primary transition-colors"
                            title="Open detailed view"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ======================== GITHUB PROJECTS BOARD VIEW ======================== */
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1100px] items-start">
            {ORDERED_STATUSES.filter((st) => st !== "CANCELLED" || tasksByStatus.CANCELLED.length > 0).map(
              (statusKey) => {
                const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.TODO;
                const columnTasks = tasksByStatus[statusKey] || [];

                return (
                  <div
                    key={statusKey}
                    className="flex-1 min-w-[280px] max-w-[340px] bg-card/60 backdrop-blur-sm border border-cardBorder rounded-2xl flex flex-col shadow-sm"
                  >
                    {/* Column Header */}
                    <div
                      className={`p-3.5 border-b ${config.headerBorder} ${config.headerBg} rounded-t-2xl flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
                        <h3 className="text-xs font-black text-title uppercase tracking-wider">
                          {config.label}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-inputBg text-muted border border-cardBorder">
                          {columnTasks.length}
                        </span>
                      </div>

                      <button
                        onClick={() => openAddTask(statusKey)}
                        className="p-1 rounded-lg hover:bg-inputBg text-muted hover:text-title transition-colors"
                        title={`Add task to ${config.label}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Column Cards */}
                    <div className="p-3 space-y-3 min-h-[300px] max-h-[calc(100vh-280px)] overflow-y-auto">
                      {columnTasks.length === 0 ? (
                        <div className="h-32 border border-dashed border-cardBorder rounded-xl flex flex-col items-center justify-center p-3 text-center">
                          <p className="text-[11px] text-muted mb-2">No tasks in this column</p>
                          <button
                            onClick={() => openAddTask(statusKey)}
                            className="inline-flex items-center gap-1 text-[11px] text-primary font-bold hover:underline"
                          >
                            <Plus className="w-3 h-3" />
                            Add task
                          </button>
                        </div>
                      ) : (
                        columnTasks.map((task) => {
                          const priorityConfig =
                            PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
                          const assignments = task.assignments || [];

                          return (
                            <div
                              key={task.id}
                              className="group p-3.5 rounded-xl bg-card border border-cardBorder hover:border-primary/50 shadow-sm hover:shadow-md transition-all space-y-2.5"
                            >
                              {/* Card Title (Fixed width with truncation) */}
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  to={`/workspace/${projectId}/tasks/${task.id}`}
                                  title={task.title}
                                  className="font-bold text-xs text-title hover:text-primary transition-colors block truncate max-w-[210px]"
                                >
                                  {task.title}
                                </Link>
                                <span
                                  className={`shrink-0 px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase border ${priorityConfig.badgeClass}`}
                                >
                                  {task.priority || "MED"}
                                </span>
                              </div>

                              {/* Description Preview (Truncated) */}
                              {task.description && (
                                <p
                                  title={task.description}
                                  className="text-[11px] text-muted line-clamp-2"
                                >
                                  {task.description}
                                </p>
                              )}

                              {/* Card Footer: Assignees & Move status */}
                              <div className="flex items-center justify-between pt-2 border-t border-cardBorder text-[11px]">
                                {/* Assignees */}
                                <div className="flex items-center -space-x-1">
                                  {assignments.length === 0 ? (
                                    <span className="text-[10px] text-muted italic">
                                      Unassigned
                                    </span>
                                  ) : (
                                    assignments.map((assignment, idx) => {
                                      const u = assignment.user || {};
                                      const name = u.fullName || u.username || "U";
                                      return (
                                        <div
                                          key={idx}
                                          className={`w-5 h-5 rounded-full border border-card flex items-center justify-center text-[9px] font-bold ${getAvatarColor(
                                            name
                                          )}`}
                                          title={`@${u.username} (${u.fullName})`}
                                        >
                                          {name.charAt(0).toUpperCase()}
                                        </div>
                                      );
                                    })
                                  )}
                                </div>

                                {/* Status Switcher */}
                                <select
                                  value={task.status}
                                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                  className="bg-inputBg border border-inputBorder text-[10px] font-semibold text-title rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
                                >
                                  {ORDERED_STATUSES.map((st) => (
                                    <option key={st} value={st}>
                                      {STATUS_CONFIG[st]?.label || st}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Quick Add at bottom */}
                    <div className="p-2 border-t border-cardBorder">
                      <button
                        onClick={() => openAddTask(statusKey)}
                        className="w-full py-1.5 px-3 rounded-xl hover:bg-inputBg text-muted hover:text-title text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add item</span>
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <AddTaskModal
          project={{ ...projectData, id: projectId }}
          initialStatus={prefilledStatus}
          onClose={() => setIsAddTaskModalOpen(false)}
          onTaskAdded={() => {
            handleRefresh();
            setIsAddTaskModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default ProjectTasksPage;
