var core;
(function (core) {
    class Router {
        // constructor
        /**
         * Creates an instance of Router.
         *
         * @constructor
         */
        constructor() {
            this.m_activeLink = "";
            this.m_linkData = "";
            this.m_routingTable = []; // creates an empty string array container
        }
        // public properties (getters and setters)
        /**
         * @returns {string}
         */
        get ActiveLink() {
            return this.m_activeLink;
        }
        /**
         * @param {string} link
         */
        set ActiveLink(link) {
            this.m_activeLink = link;
        }
        /**
         * @returns {string}
         */
        get LinkData() {
            return this.m_linkData;
        }
        /**
         * @param {string} link
         */
        set LinkData(data) {
            this.m_linkData = data;
        }
        // public methods
        /**
         * This method adds a new route to the Routing Table
         *
         * @param {string} route
         * @returns {void}
         */
        Add(route) {
            this.m_routingTable.push(route);
        }
        /**
         * This method replaces the reference for the Routing Table with a new one
         * Note: Routes should begin with a '/' character
         *
         * @param {string[]} routingTable
         * @returns {void}
         */
        AddTable(routingTable) {
            this.m_routingTable = routingTable;
        }
        /**
         * This method finds and returns the index of the route in the Routing Table
         * otherwise, it returns -1 if the route is not found
         *
         * @param {string} route
         * @returns {number}
         */
        Find(route) {
            return this.m_routingTable.indexOf(route);
        }
        /**
         * This method removes a Route from the Routing Table.
         * It returns true if the route was successfully removed
         * Otherwise, it returns false
         *
         * @param {string} route
         * @returns {boolean}
         */
        Remove(route) {
            // if route is found
            if (this.Find(route) > -1) {
                // remove the route
                this.m_routingTable.splice(this.Find(route), 1);
                return true;
            }
            return false;
        }
        // public override methods
        /**
         * This method overrides the built-in toString method and
         * returns the Routing Table as a comma-separated string
         *
         * @override
         * @returns {string}
         */
        toString() {
            return this.m_routingTable.toString();
        }
    }
    core.Router = Router;
})(core || (core = {}));
let router = new core.Router();
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
let route = location.pathname; // alias for location.pathname
// if route is found in the Routing Table
router.ActiveLink = (router.Find(route) > -1) ? (route == "/") ? "home" : route.substring(1) : "404";
