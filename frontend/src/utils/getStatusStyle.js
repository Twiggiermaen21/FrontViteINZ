export const getStatusStyle = (status) => {
    switch (status) {
        case "draft":
        case "to_produce":
            return "bg-yellow-600/50 text-yellow-300";
        case "waiting":
            return "bg-yellow-600/50 text-yellow-300";
        case "in_production":
            return "bg-blue-600/50 text-blue-300";
        case "done":
            return "bg-green-600/50 text-green-300";
        case "archived":
            return "bg-cyan-600/50 text-cyan-300";
        case "rejected":
            return "bg-red-600/50 text-red-300";
        default:
            return "bg-gray-600/50 text-gray-400";
    }
};