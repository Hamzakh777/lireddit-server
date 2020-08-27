"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
exports.default = {
    dbName: 'lireddit',
    user: 'postgres',
    password: 'postgres',
    debug: !constants_1.__prod__,
    type: 'postgresql',
    entities: [Post_1.Post],
};
//# sourceMappingURL=mikro-orm.config.js.map