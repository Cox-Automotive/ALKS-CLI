"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksSessionsOpen = void 0;
var tslib_1 = require("tslib");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getIamKey_1 = require("../getIamKey");
var getKeyOutput_1 = require("../getKeyOutput");
var getSessionKey_1 = require("../getSessionKey");
var log_1 = require("../log");
var trackActivity_1 = require("../trackActivity");
var tryToExtractRole_1 = require("../tryToExtractRole");
var alksAccount_1 = require("../state/alksAccount");
var alksRole_1 = require("../state/alksRole");
var outputFormat_1 = require("../state/outputFormat");
function handleAlksSessionsOpen(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var alksAccount, alksRole, err_1, key, _a, _b, _c, _d, err_2;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    alksAccount = options.account;
                    alksRole = options.role;
                    // Try to guess role from account if only account was provided
                    if (alksAccount && !alksRole) {
                        log_1.log('trying to extract role from account');
                        alksRole = tryToExtractRole_1.tryToExtractRole(alksAccount);
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 15, , 16]);
                    if (!options.default) return [3 /*break*/, 6];
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, alksAccount_1.getAlksAccount()];
                case 3:
                    alksAccount = _e.sent();
                    return [4 /*yield*/, alksRole_1.getAlksRole()];
                case 4:
                    alksRole = _e.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _e.sent();
                    errorAndExit_1.errorAndExit('Unable to load default account!', err_1);
                    return [3 /*break*/, 6];
                case 6:
                    key = void 0;
                    if (!options.iam) return [3 /*break*/, 8];
                    return [4 /*yield*/, getIamKey_1.getIamKey(alksAccount, alksRole, options.newSession, options.favorites)];
                case 7:
                    key = _e.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, getSessionKey_1.getSessionKey(alksAccount, alksRole, false, options.newSession, options.favorites)];
                case 9:
                    key = _e.sent();
                    _e.label = 10;
                case 10:
                    _b = (_a = console).log;
                    _c = getKeyOutput_1.getKeyOutput;
                    _d = options.output;
                    if (_d) return [3 /*break*/, 12];
                    return [4 /*yield*/, outputFormat_1.getOutputFormat()];
                case 11:
                    _d = (_e.sent());
                    _e.label = 12;
                case 12:
                    _b.apply(_a, [_c.apply(void 0, [_d, key,
                            options.namedProfile,
                            options.force])]);
                    log_1.log('checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 13:
                    _e.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
                case 14:
                    _e.sent();
                    return [3 /*break*/, 16];
                case 15:
                    err_2 = _e.sent();
                    errorAndExit_1.errorAndExit(err_2.message, err_2);
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksSessionsOpen = handleAlksSessionsOpen;
//# sourceMappingURL=alks-sessions-open.js.map