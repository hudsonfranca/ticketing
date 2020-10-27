"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var common_1 = require("@hsftickets/common");
var router = express_1.Router();
router.get('/api/users/currentuser', common_1.CurrentUser, function (req, res) {
    res.send({ currentUser: req.currentUser || null });
});
exports.default = router;
