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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var fs_1 = require("fs");
var path_1 = require("path");
var bcrypt_1 = require("bcrypt");
var uuid_1 = require("uuid");
var USERS_COUNT = 50;
var BASE_UPLOAD_DIR = path_1.default.join(__dirname, 'server', 'uploads');
var INTEREST_POOL = [
    'hiking', 'music', 'cooking', 'anime', 'reading', 'coding',
    'dogs', 'travel', 'fitness', 'gaming', 'movies', 'art'
];
var SEXUAL_PREFERENCES = ['heterosexual', 'homosexual', 'bisexual'];
var GENDERS = ['male', 'female', 'nonbinary'];
var BIOGRAPHY_SAMPLES = [
    "Love deep convos and late-night walks.",
    "Coffee addict, always up for an adventure.",
    "Always coding or hiking.",
    "Traveling the world one step at a time.",
    "Gamer by night, fitness freak by day.",
    "Just looking for someone to vibe with."
];
var getRandom = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
var getRandomInterests = function () {
    var shuffled = __spreadArray([], INTEREST_POOL, true).sort(function () { return 0.5 - Math.random(); });
    var count = Math.floor(Math.random() * 3) + 3; // 3 to 5 interests
    return shuffled.slice(0, count);
};
// Returns a random portrait URL for user n (0-based index)
var getPortraitUrl = function (index) {
    // Alternate male/female
    var gender = index % 2 === 0 ? 'men' : 'women';
    var number = Math.floor(Math.random() * 100); // 0-99
    return "https://randomuser.me/api/portraits/".concat(gender, "/").concat(number, ".jpg");
};
function downloadImage(url, filepath) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.get(url, { responseType: 'arraybuffer' })];
                case 1:
                    response = _a.sent();
                    fs_1.default.writeFileSync(filepath, response.data);
                    return [2 /*return*/];
            }
        });
    });
}
function generateUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, usersValues, _loop_1, i, sql;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt_1.default.hash('ayoub123', 10)];
                case 1:
                    hashedPassword = _a.sent();
                    usersValues = [];
                    _loop_1 = function (i) {
                        var userId, folderPath, portraitUrl, mainImagePath, j, copyPath, username, email, first_name, last_name, is_verified, created_at, verification_token, age, gender, sexual_preference, interests, biography, images_urls, location_1, userValues, err_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    userId = i;
                                    folderPath = path_1.default.join(BASE_UPLOAD_DIR, String(userId));
                                    if (!fs_1.default.existsSync(folderPath)) {
                                        fs_1.default.mkdirSync(folderPath, { recursive: true });
                                    }
                                    portraitUrl = getPortraitUrl(i - 1);
                                    mainImagePath = path_1.default.join(folderPath, "picture-".concat(userId, "-0.webp"));
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, downloadImage(portraitUrl, mainImagePath)];
                                case 2:
                                    _b.sent();
                                    // Copy main image 4 times to picture-{userId}-1.webp ... picture-{userId}-4.webp
                                    for (j = 1; j <= 4; j++) {
                                        copyPath = path_1.default.join(folderPath, "picture-".concat(userId, "-").concat(j, ".webp"));
                                        fs_1.default.copyFileSync(mainImagePath, copyPath);
                                    }
                                    username = "user".concat(userId);
                                    email = "ayoub".concat(userId, "@yopmail.com");
                                    first_name = "First".concat(userId);
                                    last_name = "Last".concat(userId);
                                    is_verified = Math.random() > 0.3 ? 1 : 0;
                                    created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
                                    verification_token = is_verified ? null : (0, uuid_1.v4)();
                                    age = Math.floor(Math.random() * 20) + 18;
                                    gender = getRandom(GENDERS);
                                    sexual_preference = getRandom(SEXUAL_PREFERENCES);
                                    interests = JSON.stringify(getRandomInterests());
                                    biography = getRandom(BIOGRAPHY_SAMPLES);
                                    images_urls = JSON.stringify(Array.from({ length: 5 }, function (_, idx) { return "/uploads/".concat(userId, "/picture-").concat(userId, "-").concat(idx, ".webp"); }));
                                    location_1 = "City".concat(userId, ", Country").concat(userId);
                                    userValues = "(\"".concat(username, "\", \"").concat(email, "\", \"").concat(first_name, "\", \"").concat(last_name, "\", \"").concat(hashedPassword, "\", ").concat(is_verified, ", \"").concat(created_at, "\", ").concat(verification_token ? "\"".concat(verification_token, "\"") : null, ", ").concat(age, ", \"").concat(gender, "\", \"").concat(sexual_preference, "\", '").concat(interests, "', \"").concat(biography, "\", '").concat(images_urls, "', \"").concat(location_1, "\")");
                                    usersValues.push(userValues);
                                    console.log("User ".concat(userId, ": images saved and data prepared."));
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _b.sent();
                                    console.error("Failed to download image or prepare user ".concat(userId), err_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    i = 1;
                    _a.label = 2;
                case 2:
                    if (!(i <= USERS_COUNT)) return [3 /*break*/, 5];
                    return [5 /*yield**/, _loop_1(i)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    sql = "\nINSERT INTO usersInfo (\n  username, email, first_name, last_name, password, is_verified, created_at,\n  verification_token, age, gender, sexual_preference, interests,\n  biography, images_urls, location\n) VALUES\n".concat(usersValues.join(",\n"), ";\n");
                    console.log('\n\n=== SQL INSERT STATEMENT ===\n\n');
                    console.log(sql);
                    return [2 /*return*/];
            }
        });
    });
}
generateUsers();
