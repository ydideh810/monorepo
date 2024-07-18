var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import reactStringReplace from "react-string-replace";
import { capitalizeFirstLetter, toObject } from "./common/utils";
import { Card } from "./Card";
import { Modal } from "./Modal";
import { FunctionResultModalContent } from "./common/SmartCallExecutionResult";
import { SmartObjectFunction } from "./SmartObjectFunction";
import { ComputerContext } from "./ComputerContext";
var keywords = ["_id", "_rev", "_owners", "_root", "_amount"];
var modalId = "smart-object-info-modal";
export var getFnParamNames = function (fn) {
    var match = fn.toString().match(/\(.*?\)/);
    return match ? match[0].replace(/[()]/gi, "").replace(/\s/gi, "").split(",") : [];
};
function ObjectValueCard(_a) {
    var content = _a.content;
    var isRev = /([0-9a-fA-F]{64}:[0-9]+)/g;
    var revLink = function (rev, i) { return (_jsx(Link, __assign({ to: "/objects/".concat(rev), className: "font-medium text-blue-600 dark:text-blue-500 hover:underline" }, { children: rev }), i)); };
    var formattedContent = reactStringReplace(content, isRev, revLink);
    return _jsx(Card, { content: formattedContent });
}
var SmartObjectValues = function (_a) {
    var smartObject = _a.smartObject;
    if (!smartObject)
        return _jsx(_Fragment, {});
    return (_jsx(_Fragment, { children: Object.entries(smartObject)
            .filter(function (_a) {
            var k = _a[0];
            return !keywords.includes(k);
        })
            .map(function (_a, i) {
            var key = _a[0], value = _a[1];
            return (_jsxs("div", { children: [_jsx("h3", __assign({ className: "mt-2 text-xl font-bold dark:text-white" }, { children: capitalizeFirstLetter(key) })), _jsx(ObjectValueCard, { content: toObject(value ? value : "") })] }, i));
        }) }));
};
// const revToId = (rev: string) => rev?.split(":")[0]
// const MetaData = ({ smartObject }: any) => (
//   <>
//     <h2 className="mb-2 text-4xl font-bold dark:text-white">Meta Data</h2>
//     <table className="w-full mt-4 mb-8 text-sm text-left text-gray-500 dark:text-gray-400">
//       <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//         <tr>
//           <th scope="col" className="px-6 py-3">
//             Key
//           </th>
//           <th scope="col" className="px-6 py-3">
//             Short
//           </th>
//           <th scope="col" className="px-6 py-3">
//             Value
//           </th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//           <td className="px-6 py-4 break-all">Identity</td>
//           <td className="px-6 py-4 break-all text-sm">
//             <pre>_id</pre>
//           </td>
//           <td className="px-6 py-4">
//             <Link
//               to={`/objects/${smartObject?._id}`}
//               className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
//             >
//               {smartObject?._id}
//             </Link>
//           </td>
//         </tr>
//         <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//           <td className="px-6 py-4 break-all">Revision</td>
//           <td className="px-6 py-4 break-all">
//             <pre>_rev</pre>
//           </td>
//           <td className="px-6 py-4">
//             <Link
//               to={`/objects/${smartObject?._rev}`}
//               className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
//             >
//               {smartObject?._rev}
//             </Link>
//           </td>
//         </tr>
//         <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//           <td className="px-6 py-4 break-all">Root</td>
//           <td className="px-6 py-4 break-all">
//             <pre>_root</pre>
//           </td>
//           <td className="px-6 py-4">
//             <Link
//               to={`/objects/${smartObject?._root}`}
//               className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
//             >
//               {smartObject?._root}
//             </Link>
//           </td>
//         </tr>
//         <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//           <td className="px-6 py-4 break-all">Owners</td>
//           <td className="px-6 py-4 break-all">
//             <pre>_owners</pre>
//           </td>
//           <td className="px-6 py-4">
//             <span className="font-medium text-gray-900 dark:text-white">
//               {smartObject?._owners}
//             </span>
//           </td>
//         </tr>
//         <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//           <td className="px-6 py-4 break-all">Amount</td>
//           <td className="px-6 py-4 break-all">
//             <pre>_amount</pre>
//           </td>
//           <td className="px-6 py-4">
//             <span className="font-medium text-gray-900 dark:text-white">
//               {smartObject?._amount}
//             </span>
//           </td>
//         </tr>
//         <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//           <td className="px-6 py-4 break-all">Transaction</td>
//           <td className="px-6 py-4 break-all"></td>
//           <td className="px-6 py-4">
//             <Link
//               to={`/transactions/${revToId(smartObject?._rev)}`}
//               className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
//             >
//               {revToId(smartObject?._rev)}
//             </Link>
//           </td>
//         </tr>
//       </tbody>
//     </table>
//   </>
// )
function Component() {
    var _this = this;
    var location = useLocation();
    var params = useParams();
    var navigate = useNavigate();
    var rev = useState(params.rev || "")[0];
    var computer = useContext(ComputerContext);
    var _a = useState(null), smartObject = _a[0], setSmartObject = _a[1];
    var _b = useState(false), functionsExist = _b[0], setFunctionsExist = _b[1];
    var _c = useState({}), functionResult = _c[0], setFunctionResult = _c[1];
    var options = ["object", "string", "number", "bigint", "boolean", "undefined", "symbol"];
    var _d = useState(""), modalTitle = _d[0], setModalTitle = _d[1];
    var setShow = function (flag) {
        if (flag) {
            Modal.get(modalId).show();
        }
        else {
            Modal.get(modalId).hide();
        }
    };
    useEffect(function () {
        var fetch = function () { return __awaiter(_this, void 0, void 0, function () {
            var synced, error_1, txId_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, computer.sync(rev)];
                    case 1:
                        synced = _a.sent();
                        setSmartObject(synced);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        txId_1 = rev.split(":")[0];
                        navigate("/transactions/".concat(txId_1));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetch();
    }, [computer, rev, location, navigate]);
    useEffect(function () {
        var funcExist = false;
        if (smartObject) {
            var filteredSmartObject = Object.getOwnPropertyNames(Object.getPrototypeOf(smartObject)).filter(function (key) {
                return key !== "constructor" && typeof Object.getPrototypeOf(smartObject)[key] === "function";
            });
            Object.keys(filteredSmartObject).forEach(function (key) {
                if (key) {
                    funcExist = true;
                }
            });
        }
        setFunctionsExist(funcExist);
    }, [smartObject]);
    var _e = rev.split(":"), txId = _e[0], outNum = _e[1];
    return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("h1", __assign({ className: "mb-2 text-5xl font-extrabold dark:text-white" }, { children: "Object" })), _jsxs("p", __assign({ className: "mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400" }, { children: [_jsx(Link, __assign({ to: "/transactions/".concat(txId), className: "font-medium text-blue-600 dark:text-blue-500 hover:underline" }, { children: txId })), ":", outNum] })), _jsx(SmartObjectValues, { smartObject: smartObject }), _jsx(SmartObjectFunction, { smartObject: smartObject, functionsExist: functionsExist, options: options, setFunctionResult: setFunctionResult, setShow: setShow, setModalTitle: setModalTitle })] }), _jsx(Modal.Component, { title: modalTitle, content: FunctionResultModalContent, contentData: { functionResult: functionResult }, id: modalId })] }));
}
export var SmartObject = {
    Component: Component
};
