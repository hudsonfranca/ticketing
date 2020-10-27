"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.Router();
router.post('/api/users/signout', function (req, res) {
    req.session = null;
    res.send({});
});
exports.default = router;
