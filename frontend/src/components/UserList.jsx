export default function UserList({ users = [] }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Connected:</span>

            <div className="flex -space-x-2">
                {users.map((user) => (
                    <div
                        key={user.id}
                        title={user.username}
                        style={{ backgroundColor: user.color }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-gray-800 shadow cursor-pointer transition hover:scale-110"
                    >
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                ))}
            </div>
        </div>
    );
}