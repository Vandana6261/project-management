import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { getProjectInfo, invalidateProjectCache } from '../services/projectApi';
import useAuthContext from '../context/AuthContext';
import useProjectContext from '../context/ProjectContext';
import AddMemberModal from './AddMemberModal';

// eslint-disable-next-line react-refresh/only-export-components
export const getProjectDataLoader = async ({ params }) => {
  const id = params.projectId;
  const result = await getProjectInfo(id);
  return result;
};

function ProjectOverview() {
  const context = useOutletContext();
  const contextProject = context?.projectData || context?.project;

  const [refreshedProject, setRefreshedProject] = useState(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const { user } = useAuthContext();
  const { projects, setSelectedProject } = useProjectContext();

  // Use refreshed data if for current project, otherwise use context project
  const projectData = (refreshedProject && refreshedProject.id === contextProject?.id)
    ? refreshedProject
    : contextProject;

  // Determine current user's role
  const currentUsername = typeof user === 'string' ? user : user?.username;
  const currentUserId = user?.id || user?.userId;

  const matchedMember = projectData?.members?.find((m) => {
    const memberUsername = m?.user?.username;
    const memberUserId = m?.user?.id;
    if (currentUsername && memberUsername && memberUsername.toLowerCase() === currentUsername.toLowerCase()) {
      return true;
    }
    if (currentUserId && memberUserId && memberUserId === currentUserId) {
      return true;
    }
    return false;
  });

  const matchedContextProject = projects?.find(
    (p) => (p.project?.id || p.projectId || p.id) === projectData?.id
  );

  const resolvedRole =
    matchedMember?.role ||
    matchedContextProject?.role ||
    projectData?.role ||
    '';

  const normalizedRole = resolvedRole.toLowerCase();
  const isOwnerOrAdmin = normalizedRole === 'owner' || normalizedRole === 'admin';

  const handleRefreshProject = async () => {
    const projectId = projectData?.id || contextProject?.id;
    if (!projectId) return;

    try {
      invalidateProjectCache(projectId);
      const res = await getProjectInfo(projectId, true);
      const updated = res?.data || res;
      if (updated && updated.id) {
        setRefreshedProject(updated);
        if (setSelectedProject) {
          setSelectedProject(updated);
        }
      }
    } catch (err) {
      console.error('Failed to refresh project data:', err);
    }
  };

  const handleMemberAdded = async () => {
    await handleRefreshProject();
    setIsAddMemberModalOpen(false);
  };

  if (!projectData) {
    return (
      <div className="min-h-screen bg-[var(--color-page)] flex items-center justify-center text-xs text-[var(--color-muted)]">
        Loading project details...
      </div>
    );
  }

  // Helper function to format dates nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper for priority color accents
  const getPriorityBadge = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'LOW':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  // Helper for status badge
  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'BACKLOG':
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      case 'TODO':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'IN_PROGRESS':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'IN_REVIEW':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'DONE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ACTIVE':
        return 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20';
      default:
        return 'bg-zinc-500/10 text-[var(--color-muted)] border-zinc-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-page)] text-[var(--color-body)] p-6 lg:p-10 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="bg-[var(--color-card)] border border-[var(--color-cardBorder)] rounded-2xl p-6 lg:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-title)] tracking-tight">
                  {projectData.name}
                </h1>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(projectData.status)}`}>
                  {projectData.status}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityBadge(projectData.priority)}`}>
                  {projectData.priority} Priority
                </span>
                {resolvedRole && (
                  <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 rounded-md">
                    Role: {resolvedRole}
                  </span>
                )}
              </div>
              <p className="text-[var(--color-body)] text-sm lg:text-base max-w-2xl">
                {projectData.description}
              </p>
            </div>

            {/* Timeline Meta & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex flex-col sm:flex-row gap-4 bg-[var(--color-inputBg)] border border-[var(--color-inputBorder)] p-4 rounded-xl text-xs">
                <div>
                  <span className="block text-[var(--color-muted)] font-medium">Start Date</span>
                  <span className="text-[var(--color-title)] font-semibold mt-0.5 block">{formatDate(projectData.startDate)}</span>
                </div>
                <div className="hidden sm:block w-px bg-[var(--color-cardBorder)]" />
                <div>
                  <span className="block text-[var(--color-muted)] font-medium">Due Date</span>
                  <span className="text-[var(--color-title)] font-semibold mt-0.5 block">{formatDate(projectData.dueDate)}</span>
                </div>
              </div>

              {/* Owner / Admin Action Button in Header */}
              {isOwnerOrAdmin && (
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primaryHover)] text-white text-xs font-bold shadow-sm shadow-[var(--color-primary)]/20 transition-all cursor-pointer self-start sm:self-center"
                  title="Add Member to Project"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[var(--color-title)]">Team Members</h3>
              <span className="text-xs bg-[var(--color-card)] border border-[var(--color-cardBorder)] px-2.5 py-1 rounded-full text-[var(--color-muted)] font-medium">
                {projectData.members?.length || 0}
              </span>
            </div>
            {isOwnerOrAdmin && (
              <button
                onClick={() => setIsAddMemberModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/20 transition-all cursor-pointer"
                title="Add Member to Project"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            )}
          </div>

          {(!projectData.members || projectData.members.length === 0) ? (
            <div className="bg-[var(--color-card)] border border-[var(--color-cardBorder)] p-8 rounded-xl text-center text-[var(--color-muted)]">
              No members added to this project yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectData.members.map((member) => (
                <div
                  key={member.user?.id || member.id}
                  className="bg-[var(--color-card)] border border-[var(--color-cardBorder)] p-4 rounded-xl flex items-center justify-between shadow-sm hover:border-[var(--color-primary)]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] font-bold flex items-center justify-center text-sm border border-[var(--color-secondary)]/20">
                      {member.user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-title)]">{member.user?.fullName || member.user?.username || 'Member'}</h4>
                      <p className="text-xs text-[var(--color-muted)]">@{member.user?.username}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded bg-[var(--color-inputBg)] text-[var(--color-muted)] border border-[var(--color-inputBorder)]">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <AddMemberModal
          project={projectData}
          onClose={() => setIsAddMemberModalOpen(false)}
          onMemberAdded={handleMemberAdded}
        />
      )}
    </div>
  );
}

export default ProjectOverview;