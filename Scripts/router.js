var core;
(function (core) {
    var Router = /** @class */ (function () {
        // constructor
        /**
         * Creates an instance of Router.
         *
         * @constructor
         */
        function Router() {
            this.m_activeLink = "";
            this.m_linkData = "";
            this.m_routingTable = []; // creates an empty string array container
        }
        Object.defineProperty(Router.prototype, "ActiveLink", {
            // public properties (getters and setters)
            /**
             * @returns {string}
             */
            get: function () {
                return this.m_activeLink;
            },
            /**
             * @param {string} link
             */
            set: function (link) {
                this.m_activeLink = link;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "LinkData", {
            /**
             * @returns {string}
             */
            get: function () {
                return this.m_linkData;
            },
            /**
             * @param {string} link
             */
            set: function (data) {
                this.m_linkData = data;
            },
            enumerable: false,
            configurable: true
        });
        // public methods
        /**
         * This method adds a new route to the Routing Table
         *
         * @param {string} route
         * @returns {void}
         */
        Router.prototype.Add = function (route) {
            this.m_routingTable.push(route);
        };
        /**
         * This method replaces the reference for the Routing Table with a new one
         * Note: Routes should begin with a '/' character
         *
         * @param {string[]} routingTable
         * @returns {void}
         */
        Router.prototype.AddTable = function (routingTable) {
            this.m_routingTable = routingTable;
        };
        /**
         * This method finds and returns the index of the route in the Routing Table
         * otherwise, it returns -1 if the route is not found
         *
         * @param {string} route
         * @returns {number}
         */
        Router.prototype.Find = function (route) {
            return this.m_routingTable.indexOf(route);
        };
        /**
         * This method removes a Route from the Routing Table.
         * It returns true if the route was successfully removed
         * Otherwise, it returns false
         *
         * @param {string} route
         * @returns {boolean}
         */
        Router.prototype.Remove = function (route) {
            // if route is found
            if (this.Find(route) > -1) {
                // remove the route
                this.m_routingTable.splice(this.Find(route), 1);
                return true;
            }
            return false;
        };
        // public override methods
        /**
         * This method overrides the built-in toString method and
         * returns the Routing Table as a comma-separated string
         *
         * @override
         * @returns {string}
         */
        Router.prototype.toString = function () {
            return this.m_routingTable.toString();
        };
        return Router;
    }());
    core.Router = Router;
})(core || (core = {}));
var router = new core.Router();
router.AddTable([
    "/",
    "/home",
    "/about",
    "/services",
    "/contact",
    "/contact-list",
    "/products",
    "/register",
    "/login",
    "/edit",
    "/task-list"
]);
var route = location.pathname; // alias for location.pathname
// if route is found in the Routing Table
router.ActiveLink = (router.Find(route) > -1) ? (route == "/") ? "home" : route.substring(1) : "404";
