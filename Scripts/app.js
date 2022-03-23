// IIFE -- Immediately Invoked Function Expression
// AKA -- Anonymous Self-Executing Function
(function () {
    function AuthGuard() {
        var protected_routes = [
            "contact-list", 
            "task-list"
        ];
        if (protected_routes.indexOf(router.ActiveLink) > -1) {
            // check if user is logged in
            if (!sessionStorage.getItem("user")) {
                // if not...change the active link to the  login page
                router.ActiveLink = "login";
            }
        }
    }
    function LoadLink(link, data) {
        if (data === void 0) { data = ""; }
        router.ActiveLink = link;
        AuthGuard();
        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink);
        // capitalize active link and set document title to it
        document.title = router.ActiveLink.substring(0, 1).toUpperCase() + router.ActiveLink.substring(1);
        // remove all active Nav Links
        $("ul>li>a").each(function () {
            $(this).removeClass("active");
        });
        $("li>a:contains(".concat(document.title, ")")).addClass("active"); // updates the Active link on Navigation items
        CheckLogin();
        LoadContent();
    }
    function AddNavigationEvents() {
        var NavLinks = $("ul>li>a"); // find all Navigation Links
        NavLinks.off("click");
        NavLinks.off("mouseover");
        // loop through each Navigation link and load appropriate content on click
        NavLinks.on("click", function () {
            LoadLink($(this).attr("data"));
        });
        NavLinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function AddLinkEvents(link) {
        var linkQuery = $("a.link[data=".concat(link, "]"));
        // remove all link events
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");
        // css adjustments for links
        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");
        // add link events
        linkQuery.on("click", function () {
            LoadLink("".concat(link));
        });
        linkQuery.on("mouseover", function () {
            $(this).css('cursor', 'pointer');
            $(this).css('font-weight', 'bold');
        });
        linkQuery.on("mouseout", function () {
            $(this).css('font-weight', 'normal');
        });
    }
    /**
     * This function loads the header.html content into a page
     *
     * @returns {void}
     */
    function LoadHeader() {
        // use AJAX to load the header content
        $.get("./Views/components/header.html", function (html_data) {
            // inject Header content into the page
            $("header").html(html_data);
            AddNavigationEvents();
            CheckLogin();
        });
    }
    /**
     *
     *
     * @returns {void}
     */
    function LoadContent() {
        var page_name = router.ActiveLink; // alias for the Active Link
        var callback = ActiveLinkCallBack(); // returns a reference to the correct function
        $.get("./Views/content/".concat(page_name, ".html"), function (html_date) {
            $("main").html(html_date);
            callback(); // calling the correct function 
        });
    }
    /**
     *
     * @returns {void}
     */
    function LoadFooter() {
        $.get("./Views/components/footer.html", function (html_date) {
            $("footer").html(html_date);
        });
    }
    function DisplayHomePage() {
        console.log("Home Page");
        $("#AboutUsButton").on("click", function () {
            LoadLink("about");
        });
        $("main").append("<p id=\"MainParagraph\" class=\"mt-3\">This is the Main Paragraph</p>");
        $("main").append("<article>\n        <p id=\"ArticleParagraph\" class =\"mt-3\">This is the Article Paragraph</p>\n        </article>");
    }
    function DisplayProductsPage() {
        console.log("Products Page");
    }
    function DisplayServicesPage() {
        console.log("Services Page");
    }
    function DisplayAboutPage() {
        console.log("About Page");
    }
    /**
     *This function adds a Contact object to localStorage
     *
     * @param {string} fullName
     * @param {string} contactNumber
     * @param {string} emailAddress
     */
    function AddContact(fullName, contactNumber, emailAddress) {
        var contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            var key = contact.FullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    /**
     * This method validates a field in the form and displays an error in the message area div element
     *
     * @param {string} fieldID
     * @param {RegExp} regular_expression
     * @param {string} error_message
     */
    function ValidateField(fieldID, regular_expression, error_message) {
        var messageArea = $("#messageArea").hide();
        $("#" + fieldID).on("blur", function () {
            var text_value = $(this).val();
            if (!regular_expression.test(text_value)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
    }
    function ContactFormValidation() {
        ValidateField("fullName", /^([A-Z][a-z]{1,3}.?\s)?([A-Z][a-z]{1,})((\s|,|-)([A-Z][a-z]{1,}))*(\s|,|-)([A-Z][a-z]{1,})$/, "Please enter a valid Full Name. This must include at least a Capitalized First Name and a Capitalized Last Name.");
        ValidateField("contactNumber", /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Please enter a valid Contact Number. Example: (416) 555-5555");
        ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address.");
    }
    function DisplayContactPage() {
        console.log("Contact Page");
        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function () {
            LoadLink("contact-list");
        });
        ContactFormValidation();
        var sendButton = document.getElementById("sendButton");
        var subscribeCheckbox = document.getElementById("subscribeCheckbox");
        sendButton.addEventListener("click", function (event) {
            if (subscribeCheckbox.checked) {
                var fullName = document.forms[0].fullName.value;
                var contactNumber = document.forms[0].contactNumber.value;
                var emailAddress = document.forms[0].emailAddress.value;
                var contact = new core.Contact(fullName, contactNumber, emailAddress);
                if (contact.serialize()) {
                    var key = contact.FullName.substring(0, 1) + Date.now();
                    localStorage.setItem(key, contact.serialize());
                }
            }
        });
    }
    function DisplayContactListPage() {
        if (localStorage.length > 0) {
            var contactList = document.getElementById("contactList");
            var data = "";
            var keys = Object.keys(localStorage); // returns a list of keys from localStorage
            var index = 1;
            // for every key in the keys string array
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var contactData = localStorage.getItem(key); // get localStorage data value
                var contact = new core.Contact(); // create an empty Contact object
                contact.deserialize(contactData);
                data += "<tr>\n                <th scope=\"row\" class=\"text-center\">".concat(index, "</th>\n                <td>").concat(contact.FullName, "</td>\n                <td>").concat(contact.ContactNumber, "</td>\n                <td>").concat(contact.EmailAddress, "</td>\n                <td class=\"text-center\"><button value=\"").concat(key, "\" class=\"btn btn-primary btn-sm edit\"><i class=\"fas fa-edit fa-sm\"></i> Edit</button></td>\n                <td class=\"text-center\"><button value=\"").concat(key, "\" class=\"btn btn-danger btn-sm delete\"><i class=\"fas fa-trash-alt fa-sm\"></i> Delete</button></td>\n                </tr>");
                index++;
            }
            contactList.innerHTML = data;
            $("button.delete").on("click", function () {
                if (confirm("Are you sure?")) {
                    localStorage.removeItem($(this).val());
                }
                LoadLink("contact-list");
            });
            $("button.edit").on("click", function () {
                LoadLink("edit", $(this).val());
            });
        }
        $("#addButton").on("click", function () {
            LoadLink("edit", "add");
        });
    }
    /**
     * This function allows JavaScript to work on the Edit Page
     */
    function DisplayEditPage() {
        console.log("Edit Page");
        ContactFormValidation();
        var page = router.LinkData;
        switch (page) {
            case "add":
                {
                    $("main>h1").text("Add Contact");
                    $("#editButton").html("<i class=\"fas fa-plus-circle fa-lg\"></i> Add");
                    $("#editButton").on("click", function (event) {
                        event.preventDefault();
                        var fullName = document.forms[0].fullName.value;
                        var contactNumber = document.forms[0].contactNumber.value;
                        var emailAddress = document.forms[0].emailAddress.value;
                        AddContact(fullName, contactNumber, emailAddress);
                        LoadLink("contact-list");
                    });
                    $("#cancelButton").on("click", function () {
                        LoadLink("contact-list");
                    });
                }
                break;
            default:
                {
                    // get contact info from localStorage
                    var contact_1 = new core.Contact();
                    contact_1.deserialize(localStorage.getItem(page));
                    // display the contact in the edit form
                    $("#fullName").val(contact_1.FullName);
                    $("#contactNumber").val(contact_1.ContactNumber);
                    $("#emailAddress").val(contact_1.EmailAddress);
                    $("#editButton").on("click", function (event) {
                        event.preventDefault();
                        // get changes from the page
                        contact_1.FullName = $("#fullName").val();
                        contact_1.ContactNumber = $("#contactNumber").val();
                        contact_1.EmailAddress = $("#emailAddress").val();
                        // replace the item in local storage
                        localStorage.setItem(page, contact_1.serialize());
                        // go back to the contact list page (refresh)
                        LoadLink("contact-list");
                    });
                    $("#cancelButton").on("click", function () {
                        LoadLink("contact-list");
                    });
                }
                break;
        }
    }
    function CheckLogin() {
        // if user is logged in
        if (sessionStorage.getItem("user")) {
            // swap out the login link for logout
            $("#login").html("<a id=\"logout\" class=\"nav-link\" href=\"#\"><i class=\"fas fa-sign-out-alt\"></i> Logout</a>");
            $("#login").html("<li class=\"nav-item\"><a class=\"nav-link\" data=\"task-list\">Task List </a></li>").insertAfter("li.nav-item:eq(5)");
            
            $("#logout").on("click", function () {
                // perform logout
                sessionStorage.clear();
                // swap out the logout link for login
                $("#login").html("<a class=\"nav-link\" data=\"login\"><i class=\"fas fa-sign-in-alt\"></i> Login</a>");
                AddNavigationEvents();
                // redirect back to login
                LoadLink("login");
            });
        }
    }

    function taskListNavLink()
    {
        let taskListNavLink = document.createElement('a');
        taskListNavLink.setAttribute('class', 'nav-link');
        taskListNavLink.setAttribute('data', 'task-list');
        taskListNavLink.textContent = 'Task List';

        // Create li node and attributes
        let liTag = document.createElement('li');
        liTag.setAttribute('class', 'nav-item');

        // Create i class design node and attributes
        let iDesign = document.createElement('i');
        iDesign.setAttribute('class', 'fa-solid fa-list');
        
        // Append i design node as child of HR Link
        taskListNavLink.appendChild(iDesign);

        // Append HR Link node as child of liTag
        liTag.appendChild(taskListNavLink);

        // Look for the ul node and append the created liTag node as a child
        document.querySelector('ul').appendChild(liTag);

        // find the ul element and store it in parent node
        let parentNode = document.querySelector("ul");

        // Get the 5th li node
        let contactContent = document.getElementsByTagName("li")[5];

        // Insert liTag before contactContent.
        parentNode.insertBefore(liTag, contactContent);
    }

    function DisplayLoginPage() {
        console.log("Login Page");
        var messageArea = $("#messageArea");
        messageArea.hide();
        //let taskListNav = $("<li class=\"nav-item\"><a class=\"nav-link\" data=\"task-list\">Task List </a></li>").insertAfter("li.nav-item:eq(5)");
        
        AddLinkEvents("register");
        $("#loginButton").on("click", function () {
            var success = false;
            // create an empty user object
            var newUser = new core.User();
            // uses jQuery shortcut to load the users.json file
            $.get("./Data/users.json", function (data) {
                // for every user in the users.json file
                for (var _i = 0, _a = data.users; _i < _a.length; _i++) {
                    var user = _a[_i];
                    var username = document.forms[0].username.value;
                    var password = document.forms[0].password.value;
                    // check if the username and password entered in the form matches this user
                    if (username == user.Username && password == user.Password) {
                        // get the user data from the file and assign to our empty user object
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }
                // if username and password matches - success.. the perform the login sequence
                if (success) {
                    // add user to session storage
                    sessionStorage.setItem("user", newUser.serialize());
                    // hide any error message
                    messageArea.removeAttr("class").hide();
                    // redirect the user to the secure area of our site - contact-list.html
                    LoadLink("contact-list");
                    AddLinkEvents("task-list");
                    //$("<li class=\"nav-item\"><a class=\"nav-link\" data=\"task-list\">Task List </a></li>").insertAfter("li.nav-item:eq(5)");
                    //AddLinkEvents("task-list");
                    //$('<li class="nav-item" id="task-list"><a class="nav-link" data="task-list"><i class="fas fa-sign-in-alt"></i> Task List</a></li>').insertAfter("li.nav-item:eq(5)");
                }
                // else if bad credentials were entered...
                else {
                    // display an error message
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid Login Information").show();
                }
            });
        });
        $("#cancelButton").on("click", function () {
            // clear the login form
            document.forms[0].reset();
            // return to the home page
            LoadLink("home");
        });
    }
    function DisplayRegisterPage() {
        console.log("Register Page");
        AddLinkEvents("login");
    }
    function Display404Page() {
    }
    /**
     * This function adds a new Task to the TaskList
     */
    function AddNewTask() {
        var messageArea = $("#messageArea");
        messageArea.hide();
        var taskInput = $("#taskTextInput");
        var taskInputValue = taskInput.val();
        if (taskInput.val() != "" && taskInputValue.charAt(0) != " ") {
            var newElement = "\n               <li class=\"list-group-item\" id=\"task\">\n               <span id=\"taskText\">".concat(taskInput.val(), "</span>\n               <span class=\"float-end\">\n                   <button class=\"btn btn-outline-primary btn-sm editButton\"><i class=\"fas fa-edit\"></i>\n                   <button class=\"btn btn-outline-danger btn-sm deleteButton\"><i class=\"fas fa-trash-alt\"></i></button>\n               </span>\n               <input type=\"text\" class=\"form-control edit-task editTextInput\">\n               </li>\n               ");
            $("#taskList").append(newElement);
            messageArea.removeAttr("class").hide();
            taskInput.val("");
        }
        else {
            taskInput.trigger("focus").trigger("select");
            messageArea.show().addClass("alert alert-danger").text("Please enter a valid Task.");
        }
    }
    /**
     * This function is the Callback function for the TaskList
     *
     */
    function DisplayTaskList() {

        
        var messageArea = $("#messageArea");
        messageArea.hide();
        var taskInput = $("#taskTextInput");
        // add a new Task to the Task List
        $("#newTaskButton").on("click", function () {
            AddNewTask();
        });
        taskInput.on("keypress", function (event) {
            if (event.key == "Enter") {
                AddNewTask();
            }
        });
        // Edit an Item in the Task List
        $("ul").on("click", ".editButton", function () {
            var editText = $(this).parent().parent().children(".editTextInput");
            var text = $(this).parent().parent().text();
            var editTextValue = editText.val();
            editText.val(text).show().trigger("select");
            editText.on("keypress", function (event) {
                if (event.key == "Enter") {
                    if (editText.val() != "" && editTextValue.charAt(0) != " ") {
                        editText.hide();
                        $(this).parent().children("#taskText").text(editTextValue);
                        messageArea.removeAttr("class").hide();
                    }
                    else {
                        editText.trigger("focus").trigger("select");
                        messageArea.show().addClass("alert alert-danger").text("Please enter a valid Task.");
                    }
                }
            });
        });
        // Delete a Task from the Task List
        $("ul").on("click", ".deleteButton", function () {
            if (confirm("Are you sure?")) {
                $(this).closest("li").remove();
            }
        });
    }
    /**
     * This method returns the appropriate function callback relative to the Active Link
     *
     * @returns {Function}
     */
    function ActiveLinkCallBack() {
        switch (router.ActiveLink) {
            case "home": return DisplayHomePage;
            case "about": return DisplayAboutPage;
            case "products": return DisplayProductsPage;
            case "services": return DisplayServicesPage;
            case "contact": return DisplayContactPage;
            case "contact-list": return DisplayContactListPage;
            case "edit": return DisplayEditPage;
            case "login": return DisplayLoginPage;
            case "register": return DisplayRegisterPage;
            case "404": return Display404Page;
            case "task-list": return DisplayTaskList;

            default:
                console.error("ERROR: callback does not exist: " + router.ActiveLink);
                return new Function();
        
            
        }
    }
    // named function option
    /**
     * This is the entry point to the web application
     *
     */
    function Start() {
        console.log("App Started!");
        LoadHeader();
        LoadLink("home");
        LoadFooter();
    }
    window.addEventListener("load", Start);
})();
