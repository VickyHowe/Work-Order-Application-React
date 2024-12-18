const userRoleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }
});

const UserRole = mongoose.model("User Role", userRoleSchema);
module.exports = UserRole;