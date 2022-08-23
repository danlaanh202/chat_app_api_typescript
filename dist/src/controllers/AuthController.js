"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    register(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new User_1.default({
                username: (_a = req.body) === null || _a === void 0 ? void 0 : _a.username.trim().toLowerCase(),
                password: crypto_js_1.default.AES.encrypt((_b = req.body) === null || _b === void 0 ? void 0 : _b.password, process.env.PASS_SEC).toString(),
            });
            try {
                const savedUser = yield newUser.save();
                return res.status(201).json(savedUser);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findOne({ username: req.body.username });
                if (!user)
                    return res.status(404).json("No user Found");
                const hashedPassword = crypto_js_1.default.AES.decrypt(user.password, process.env.PASS_SEC);
                const OriginalPassword = hashedPassword.toString(crypto_js_1.default.enc.Utf8);
                if (OriginalPassword !== req.body.password)
                    return res.status(401).json("Wrong password");
                const accessToken = jsonwebtoken_1.default.sign({
                    id: user._id,
                    isAdmin: user.isAdmin,
                }, process.env.JWT_SEC);
                const _a = user._doc, { password } = _a, others = __rest(_a, ["password"]);
                return res.status(200).json(Object.assign(Object.assign({}, others), { accessToken }));
            }
            catch (err) {
                console.log(err);
                return res.status(500).json(err);
            }
        });
    }
}
exports.default = new AuthController();
