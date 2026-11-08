export default function UserList({ users = [] }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Active:</span>
            </div>

            <div className="flex -space-x-1.5 overflow-hidden p-0.5">
                {users.map((user) => (
                    <div
                        key={user.id}
                        title={user.username}
                        style={{ backgroundColor: user.color }}
                        className="relative inline-flex items-center justify-center w-7 h-7 rounded-full text-white font-semibold text-[11px] ring-2 ring-zinc-950 shadow-md transition-transform duration-150 hover:scale-110 hover:z-10 cursor-pointer select-none"
                    >
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                ))}
            </div>
        </div>
    );
}