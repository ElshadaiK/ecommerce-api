const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    guard_name: { type: String, default: 'API' },
},{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});

module.exports = mongoose.model('Permissions', PermissionSchema);