'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = require('./const');

var _graphqlRequest = require('graphql-request');

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getSocketOptions(serviceId, environment) {
    return {
        query: 'serviceId=' + serviceId + '&environment=' + environment
    };
}
var query = /* GraphQL */'\n query String($serviceId: String, $environment: String){\n\tlatestConfig(serviceId: $serviceId, environment: $environment)\n}';

var ConfigManager = function () {
    function ConfigManager() {
        _classCallCheck(this, ConfigManager);
    }

    _createClass(ConfigManager, [{
        key: 'initializeConfig',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, serviceId, environment, options) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.options = options || {};
                                this.serviceId = serviceId;
                                this.environment = environment;
                                this.gqlClient = new _graphqlRequest.GraphQLClient(url + _const.GRAPHQL_PATH);
                                this.initializeSocket(url, serviceId, environment);
                                _context.next = 7;
                                return this.getConfigData();

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function initializeConfig(_x, _x2, _x3, _x4) {
                return _ref.apply(this, arguments);
            }

            return initializeConfig;
        }()
    }, {
        key: 'initializeSocket',
        value: function initializeSocket(url, serviceID, environment) {
            this.socket = (0, _socket2.default)(url, getSocketOptions(serviceID, environment));
            this.socket.on(_const.CONFIG_UPDATE_EVENT, this.getConfigData);
        }
    }, {
        key: 'getConfigData',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var _this = this;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.data = new Promise(function () {
                                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve) {
                                        var data;
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _context2.next = 2;
                                                        return _this.gqlClient.request(query, { environment: _this.environment, serviceId: _this.serviceId });

                                                    case 2:
                                                        data = _context2.sent;

                                                        if (_this.options.callback) _this.options.callback();
                                                        resolve(JSON.parse(data.latestConfig));

                                                    case 5:
                                                    case 'end':
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this);
                                    }));

                                    return function (_x5) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }());

                            case 1:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getConfigData() {
                return _ref2.apply(this, arguments);
            }

            return getConfigData;
        }()
    }, {
        key: 'getData',
        value: function getData() {
            return this.data;
        }
    }]);

    return ConfigManager;
}();

exports.default = new ConfigManager();