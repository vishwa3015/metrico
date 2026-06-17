import { useState, useEffect, useRef } from "react";
import { Plus, MoreHorizontal, Pencil, UserX, UserCheck, X, Search, ChevronLeft, ChevronRight, ChevronDown, Check } from "lucide-react";
import { Card, SectionHeader } from "@/components/common/primitives";
import { useUsers } from "@/hooks/useUsers";
import type { ApiUser, CreateUserPayload, UserRole, UserStatus } from "@/types/users.types";
import { useFacilities } from "@/hooks/useFacilities";
import { usersService } from "@/services/users.service";
import { toast } from "sonner";

const roleColor: Record<UserRole, string> = {
    "Admin": "bg-sky-50 text-sky-700 ring-sky-200",
    "Supervisor": "bg-teal-50 text-teal-700 ring-teal-200",
    "Testing Staff": "bg-slate-100 text-slate-700 ring-slate-200",
};

const statusStyle: Record<UserStatus, { cls: string; label: string }> = {
    Active: { cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", label: "Active" },
    Invited: { cls: "bg-amber-50 text-amber-700 ring-amber-200", label: "Invited" },
    Inactive: { cls: "bg-slate-100 text-slate-600 ring-slate-200", label: "Deactivated" },
};

const ROLE_OPTIONS: UserRole[] = ["Admin", "Supervisor", "Testing Staff"];
const STATUS_OPTIONS: UserStatus[] = ["Active", "Invited", "Inactive"];

function timeAgo(dateStr: string | null): string {
    if (!dateStr) return "—";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Active now";
    if (mins < 60) return `${mins} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
}

export function UsersScreen() {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [editUser, setEditUser] = useState<ApiUser | null>(null);
    const [statusTarget, setStatusTarget] = useState<ApiUser | null>(null);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
    const [facilityFilter, setFacilityFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<UserStatus | "">("");
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const limit = 50;

    const facilities = useFacilities();

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query.trim()), 400);
        return () => clearTimeout(t);
    }, [query]);

    useEffect(() => {
        setPage(1);
    }, [debouncedQuery, roleFilter, facilityFilter, statusFilter]);

    const { data: users, loading, error, pagination, refetch } = useUsers({
        search: debouncedQuery || undefined,
        role: roleFilter || undefined,
        facility_id: facilityFilter || undefined,
        status: statusFilter || undefined,
        page,
        limit,
    });

    const hasFilters = !!(roleFilter || facilityFilter || statusFilter || debouncedQuery);

    return (
        <div className="px-8 py-6 space-y-4">
            <Card className="p-5">
                <SectionHeader
                    title="Users"
                    description="Manage who can perform or review tests across your facilities."
                    action={
                        <button
                            onClick={() => setShowAdd(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-teal-500 to-teal-600 px-3.5 py-2 text-sm text-white shadow-sm ring-1 ring-inset ring-teal-700/20 hover:from-teal-500 hover:to-teal-700"
                        >
                            <Plus className="h-4 w-4" /> Add User
                        </button>
                    }
                />

                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, email, or facility…"
                            className="h-9 w-80 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                        />
                    </div>

                    <FilterSelect
                        label="Role"
                        value={roleFilter}
                        onChange={(v) => setRoleFilter(v as UserRole | "")}
                        open={openFilter === "role"}
                        onOpenChange={(o) => setOpenFilter(o ? "role" : null)}
                        options={[
                            { value: "", label: "All roles" },
                            ...ROLE_OPTIONS.map(r => ({ value: r, label: r })),
                        ]}
                    />
                    <FilterSelect
                        label="Facility"
                        value={facilityFilter}
                        onChange={setFacilityFilter}
                        open={openFilter === "facility"}
                        onOpenChange={(o) => setOpenFilter(o ? "facility" : null)}
                        options={[
                            { value: "", label: "All facilities" },
                            ...facilities.map(f => ({ value: f.facility_id, label: f.facility_name })),
                        ]}
                    />
                    <FilterSelect
                        label="Status"
                        value={statusFilter}
                        onChange={(v) => setStatusFilter(v as UserStatus | "")}
                        open={openFilter === "status"}
                        onOpenChange={(o) => setOpenFilter(o ? "status" : null)}
                        options={[
                            { value: "", label: "Any" },
                            ...STATUS_OPTIONS.map(s => ({ value: s, label: statusStyle[s].label })),
                        ]}
                    />

                    {hasFilters && (
                        <button
                            onClick={() => {
                                setQuery("");
                                setRoleFilter("");
                                setFacilityFilter("");
                                setStatusFilter("");
                            }}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                        >
                            <X className="h-3.5 w-3.5" /> Clear filters
                        </button>
                    )}
                </div>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="overflow-hidden rounded-xl border border-slate-200 divide-y divide-slate-100">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-4 py-3 animate-pulse">
                                <div className="h-8 w-8 rounded-full bg-slate-200" />
                                <div className="h-3 w-32 rounded bg-slate-200" />
                                <div className="h-3 w-24 rounded bg-slate-200" />
                                <div className="h-5 w-16 rounded bg-slate-200" />
                                <div className="h-3 w-16 rounded bg-slate-200 ml-auto" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && (
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50/80 text-slate-500">
                                <tr className="text-left">
                                    <Th>Name</Th>
                                    <Th>Email</Th>
                                    <Th>Role</Th>
                                    <Th>Facility</Th>
                                    <Th>Status</Th>
                                    <Th>Last Active</Th>
                                    <Th className="text-right pr-4">Actions</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map(u => {
                                    const s = statusStyle[u.status];
                                    const isOpen = openMenu === u.user_id;
                                    const name = `${u.first_name} ${u.last_name}`;
                                    const initials = `${u.first_name[0]}${u.last_name[0]}`.toUpperCase();
                                    const facilityName = (u as any).Facility?.facility_name ?? u.facility?.facility_name ?? '—';

                                    return (
                                        <tr key={u.user_id} className="hover:bg-slate-50/60">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 text-white flex items-center justify-center text-xs shrink-0">
                                                        {initials}
                                                    </div>
                                                    <div className="text-slate-800">{name}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{u.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ring-1 ring-inset ${roleColor[u.role]}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700">{facilityName}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs ring-1 ring-inset ${s.cls}`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                                    {s.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {u.status === 'Invited' ? 'Invite pending' : timeAgo(u.last_login_at)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1.5 relative">
                                                    <button
                                                        onClick={() => setEditUser(u)}
                                                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setOpenMenu(isOpen ? null : u.user_id)}
                                                        className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                    {isOpen && (
                                                        <div
                                                            onMouseLeave={() => setOpenMenu(null)}
                                                            className="absolute right-0 top-9 z-10 w-52 rounded-lg border border-slate-200 bg-white shadow-lg py-1 text-sm"
                                                        >
                                                            <MenuItem
                                                                Icon={Pencil}
                                                                label="Edit User"
                                                                onClick={() => { setEditUser(u); setOpenMenu(null); }}
                                                            />
                                                            <div className="my-1 h-px bg-slate-100" />
                                                            <MenuItem
                                                                Icon={UserX}
                                                                label={u.status === 'Inactive' ? 'Reactivate User' : 'Deactivate User'}
                                                                onClick={() => { setStatusTarget(u); setOpenMenu(null); }}
                                                                danger={u.status !== 'Inactive'}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                    <span>
                        {pagination.total === 0
                            ? "0 users"
                            : `${(pagination.page - 1) * pagination.limit + 1}–${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} users`}
                    </span>
                    <div className="flex items-center gap-3">
                        <span>Page {pagination.page} of {pagination.pages || 1}</span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={pagination.page <= 1}
                                className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.pages || 1, p + 1))}
                                disabled={pagination.page >= (pagination.pages || 1)}
                                className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {showAdd && (
                <UserModal
                    title="Add user"
                    onClose={(saved) => { setShowAdd(false); if (saved) refetch(); }}
                />
            )}
            {editUser && (
                <UserModal
                    title="Edit user"
                    user={editUser}
                    onClose={(saved) => { setEditUser(null); if (saved) refetch(); }}
                />
            )}
            {statusTarget && (
                <StatusConfirmDialog
                    user={statusTarget}
                    onClose={(changed) => { setStatusTarget(null); if (changed) refetch(); }}
                />
            )}
        </div>
    );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <th className={`px-4 py-3 font-normal text-xs uppercase tracking-wider whitespace-nowrap ${className}`}>
            {children}
        </th>
    );
}

function FilterSelect({ label, value, options, onChange, open, onOpenChange }: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const selected = options.find(o => o.value === value);

    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onOpenChange(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open, onOpenChange]);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => onOpenChange(!open)}
                className={`inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-sm hover:bg-slate-50 ${
                    open ? "border-teal-300 ring-2 ring-teal-100" : "border-slate-200"
                }`}
            >
                <span className="text-xs text-slate-500">{label}:</span>
                <span className="text-slate-800">{selected?.label ?? value}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute left-0 top-[calc(100%+4px)] z-10 min-w-[180px] rounded-lg border border-slate-200 bg-white shadow-lg py-1 text-sm">
                    {options.map(o => {
                        const isSelected = o.value === value;
                        return (
                            <button
                                key={o.value}
                                onClick={() => { onChange(o.value); onOpenChange(false); }}
                                className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-slate-50 ${
                                    isSelected ? "text-teal-700" : "text-slate-700"
                                }`}
                            >
                                <span>{o.label}</span>
                                {isSelected && <Check className="h-3.5 w-3.5" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function MenuItem({ Icon, label, onClick, danger }: {
    Icon: any;
    label: string;
    onClick: () => void;
    danger?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-2 px-3 py-1.5 hover:bg-slate-50 ${danger ? "text-rose-700 hover:bg-rose-50" : "text-slate-700"}`}
        >
            <Icon className="h-4 w-4" /> {label}
        </button>
    );
}

function StatusConfirmDialog({ user, onClose }: {
    user: ApiUser;
    onClose: (changed: boolean) => void;
}) {
    const [saving, setSaving] = useState(false);
    const isDeactivating = user.status !== 'Inactive';
    const nextStatus: UserStatus = isDeactivating ? 'Inactive' : 'Active';
    const name = `${user.first_name} ${user.last_name}`;

    const handleConfirm = async () => {
        setSaving(true);
        try {
            await usersService.setUserStatus(user.user_id, nextStatus);
            toast.success(isDeactivating ? `${name} has been deactivated.` : `${name} has been reactivated.`);
            onClose(true);
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? `Failed to ${isDeactivating ? 'deactivate' : 'reactivate'} user.`;
            toast.error(msg);
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
            <div className="w-[420px] rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="p-5 space-y-3">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${isDeactivating ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                        {isDeactivating ? <UserX className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                    </div>
                    <div className="text-slate-900 tracking-tight">
                        {isDeactivating ? "Deactivate user?" : "Reactivate user?"}
                    </div>
                    <p className="text-sm text-slate-600">
                        {isDeactivating
                            ? `${name} will lose access immediately and won't be able to log in or perform tests until reactivated.`
                            : `${name} will regain access and be able to log in again.`}
                    </p>
                </div>

                <div className="border-t border-slate-100 px-5 py-3 flex items-center gap-2 justify-end">
                    <button
                        onClick={() => onClose(false)}
                        disabled={saving}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={saving}
                        className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm text-white shadow-sm ring-1 ring-inset disabled:opacity-50 ${
                            isDeactivating
                                ? "bg-gradient-to-b from-rose-500 to-rose-600 ring-rose-700/20 hover:from-rose-500 hover:to-rose-700"
                                : "bg-gradient-to-b from-teal-500 to-teal-600 ring-teal-700/20 hover:from-teal-500 hover:to-teal-700"
                        }`}
                    >
                        {saving && (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}
                        {isDeactivating ? "Deactivate" : "Reactivate"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function UserModal({
    title,
    user,
    onClose,
}: {
    title: string
    user?: ApiUser
    onClose: (saved: boolean) => void
}) {
    const facilities = useFacilities()

    const [form, setForm] = useState<CreateUserPayload>({
        first_name: user?.first_name ?? '',
        last_name: user?.last_name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'Testing Staff',
        facility_id: user?.facility_id ?? '',
    })
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Partial<Record<keyof CreateUserPayload, string>>>({})

    const set = (k: keyof CreateUserPayload, v: string) => {
        setForm(p => ({ ...p, [k]: v }))
        setErrors(p => ({ ...p, [k]: undefined }))
    }

    const validate = () => {
        const e: typeof errors = {}
        if (!form.first_name.trim()) e.first_name = 'Required'
        if (!form.last_name.trim()) e.last_name = 'Required'
        if (!form.email.trim()) e.email = 'Required'
        if (!form.role) e.role = 'Required'
        if (!form.facility_id) e.facility_id = 'Select a facility'
        return e
    }

    const handleSubmit = async () => {
        const e = validate()
        if (Object.keys(e).length > 0) { setErrors(e); return }

        setSaving(true)
        try {
            if (user) {
                await usersService.updateUser(user.user_id, form)
                toast.success('User updated successfully.')
            } else {
                const result = await usersService.createUser(form)
                if (result.user.email_sent) {
                    toast.success(`Invite sent to ${form.email}`)
                } else {
                    navigator.clipboard.writeText(result.temp_password ?? '')
                    toast.success(`User created. Temp password copied — share it with ${form.email} manually.`, { duration: 8000 })
                }
            }
            onClose(true)
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? (user ? 'Failed to update user.' : 'Failed to create user.')
            toast.error(msg)
        } finally {
            setSaving(false)
        }   
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
            <div className="w-[460px] rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="text-slate-900 tracking-tight">{title}</div>
                    <button
                        onClick={() => onClose(false)}
                        className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-5 space-y-3">
                    <Field
                        label="First name"
                        value={form.first_name}
                        placeholder="Jane"
                        error={errors.first_name}
                        onChange={v => set('first_name', v)}
                    />
                    <Field
                        label="Last name"
                        value={form.last_name}
                        placeholder="Doe"
                        error={errors.last_name}
                        onChange={v => set('last_name', v)}
                    />
                    <Field
                        label="Work email"
                        value={form.email}
                        placeholder="name@metrico.io"
                        error={errors.email}
                        onChange={v => set('email', v)}
                    />
                    <SelectField
                        label="Role"
                        value={form.role}
                        error={errors.role}
                        options={[
                            { value: 'Testing Staff', label: 'Testing Staff' },
                            { value: 'Supervisor', label: 'Supervisor' },
                            { value: 'Admin', label: 'Admin' },
                        ]}
                        onChange={v => set('role', v as UserRole)}
                    />
                    <SelectField
                        label="Facility"
                        value={form.facility_id}
                        error={errors.facility_id}
                        options={[
                            { value: '', label: 'Select facility…' },
                            ...facilities.map(f => ({
                                value: f.facility_id,
                                label: f.facility_name,
                            })),
                        ]}
                        onChange={v => set('facility_id', v)}
                    />
                </div>

                <div className="border-t border-slate-100 px-5 py-3 flex items-center gap-2 justify-end">
                    <button
                        onClick={() => onClose(false)}
                        disabled={saving}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-teal-500 to-teal-600 px-3.5 py-2 text-sm text-white shadow-sm ring-1 ring-inset ring-teal-700/20 disabled:opacity-50"
                    >
                        {saving && (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}
                        {user ? 'Save changes' : 'Send invite'}
                    </button>
                </div>
            </div>
        </div>
    )
}

function Field({ label, value, placeholder, error, onChange }: {
    label: string
    value: string
    placeholder?: string
    error?: string
    onChange: (v: string) => void
}) {
    return (
        <label className="block">
            <span className="text-xs text-slate-500">{label}</span>
            <input
                value={value}
                placeholder={placeholder}
                onChange={e => onChange(e.target.value)}
                className={`mt-1 w-full h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 ${error ? 'border-red-300' : 'border-slate-200'
                    }`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </label>
    )
}

function SelectField({ label, value, options, error, onChange }: {
    label: string
    value: string
    options: { value: string; label: string }[]
    error?: string
    onChange: (v: string) => void
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const selected = options.find(o => o.value === value)

    useEffect(() => {
        if (!open) return
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [open])

    return (
        <label className="block">
            <span className="text-xs text-slate-500">{label}</span>
            <div className="relative mt-1" ref={ref}>
                <button
                    type="button"
                    onClick={() => setOpen(o => !o)}
                    className={`flex w-full h-10 items-center justify-between rounded-lg border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 ${
                        error ? 'border-red-300' : open ? 'border-teal-400 ring-2 ring-teal-200' : 'border-slate-200'
                    }`}
                >
                    <span className={selected ? "text-slate-800" : "text-slate-400"}>
                        {selected?.label ?? "Select…"}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                    <div className="absolute left-0 top-[calc(100%+4px)] z-10 w-full max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg py-1 text-sm">
                        {options.map(o => {
                            const isSelected = o.value === value
                            return (
                                <button
                                    key={o.value}
                                    type="button"
                                    onClick={() => { onChange(o.value); setOpen(false) }}
                                    className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-slate-50 ${
                                        isSelected ? "text-teal-700" : "text-slate-700"
                                    }`}
                                >
                                    <span>{o.label}</span>
                                    {isSelected && <Check className="h-3.5 w-3.5" />}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </label>
    )
}