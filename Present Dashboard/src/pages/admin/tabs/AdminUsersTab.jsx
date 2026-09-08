import React, { useState } from 'react';
import { Search, ShieldCheck, UserX, CheckCircle, Trash2, Eye, Mail, Award } from 'lucide-react';

/**
 * ── AdminUsersTab ───────────────────────────────────────────────────
 * User management, pending approvals, status toggles, and deletion.
 */
export default function AdminUsersTab({
  users = [],
  onUpdateUserStatus,
  onDeleteUser,
  isDark = true
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);

  const filtered = users.filter(u => {
    if (statusFilter !== 'ALL') {
      const uStatus = u.status || 'active';
      if (statusFilter === 'pending' && uStatus !== 'pending') return false;
      if (statusFilter === 'active' && uStatus !== 'active') return false;
      if (statusFilter === 'suspended' && uStatus !== 'suspended') return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchName = (u.name || `${u.first_name || ''} ${u.last_name || ''}`).toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchUsername = (u.username || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchUsername) return false;
    }
    return true;
  });

  const borderColor = isDark ? 'rgba(203, 221, 233, 0.15)' : '#CBDDE9';
  const cardBg = isDark ? '#0E2740' : '#FFFFFF';
  const inputBg = isDark ? '#0B1F33' : '#F8FAFC';
  const textColor = isDark ? '#F3F7FB' : '#0D1B2A';
  const mutedColor = isDark ? '#8EA6BC' : '#64748B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: textColor }}>
            Member Directory & Approvals
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: mutedColor }}>
            Approve pending student registrations, manage roles, and review profiles.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${borderColor}`,
              backgroundColor: inputBg,
              color: textColor,
              fontSize: '12.5px',
              outline: 'none'
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="active">Active Members</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: mutedColor }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              style={{
                padding: '8px 12px 8px 32px',
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
                backgroundColor: inputBg,
                color: textColor,
                fontSize: '12.5px',
                outline: 'none',
                width: '220px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div
        style={{
          borderRadius: '18px',
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: isDark ? 'rgba(14, 39, 64, 0.5)' : '#F8FAFC', borderBottom: `1px solid ${borderColor}` }}>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Member</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Email</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Role</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700 }}>Streak</th>
                <th style={{ padding: '12px 18px', color: mutedColor, fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => {
                const uStatus = u.status || 'active';
                const isPending = uStatus === 'pending';
                const displayName = u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || 'Member';

                return (
                  <tr
                    key={u.id || idx}
                    style={{
                      borderBottom: `1px solid ${borderColor}`,
                      backgroundColor: isPending
                        ? (isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.04)')
                        : idx % 2 === 0 ? 'transparent' : (isDark ? 'rgba(203, 221, 233, 0.02)' : 'rgba(0,0,0,0.01)')
                    }}
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: textColor }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#2872A1',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '12px',
                            flexShrink: 0
                          }}
                        >
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{displayName}</div>
                          {u.username && (
                            <div style={{ fontSize: '11px', color: mutedColor, fontWeight: 400 }}>
                              @{u.username}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px', color: mutedColor }}>
                      {u.email}
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          color: u.is_admin || u.isAdmin ? '#8B5CF6' : '#2872A1',
                          backgroundColor: u.is_admin || u.isAdmin ? 'rgba(139, 92, 246, 0.12)' : 'rgba(40, 114, 161, 0.12)'
                        }}
                      >
                        {u.is_admin || u.isAdmin ? 'Admin' : 'Member'}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          color: isPending ? '#F59E0B' : uStatus === 'active' ? '#10B981' : '#EF4444',
                          backgroundColor: isPending
                            ? 'rgba(245, 158, 11, 0.12)'
                            : uStatus === 'active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)'
                        }}
                      >
                        {isPending ? 'Pending Approval' : uStatus.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', color: textColor, fontWeight: 600 }}>
                      🔥 {u.streak || 1} wks
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {isPending ? (
                          <button
                            type="button"
                            onClick={() => onUpdateUserStatus(u.id, 'active')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#10B981',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Approve
                          </button>
                        ) : uStatus === 'active' ? (
                          <button
                            type="button"
                            onClick={() => onUpdateUserStatus(u.id, 'suspended')}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2',
                              color: '#EF4444',
                              border: 'none',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onUpdateUserStatus(u.id, 'active')}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#DCFCE7',
                              color: '#10B981',
                              border: 'none',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Activate
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Permanently delete account for "${displayName}"?`)) {
                              onDeleteUser(u.id);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                          title="Delete User"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
