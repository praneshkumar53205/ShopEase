let registerButton = document.getElementById("registerButton");
let clearDataButton = document.getElementById("clearDataButton");
let emailInput = document.getElementById("email");
let emailError = document.getElementById("emailError");
let nameInput = document.getElementById("name");
let message = document.getElementById("message");
nameInput.addEventListener("input", function() {

    if (
        message.textContent === "Please enter your name." ||
        message.textContent === "Please enter a valid name using letters only."
    ) {

        message.textContent = "";

    }

});
emailInput.addEventListener("input", function() {
    console.log("Email typed:", emailInput.value);

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailInput.value.trim() === "") {
        

        emailError.textContent = "";
        emailInput.style.border = "";

    } else if (!emailPattern.test(emailInput.value.trim())) {

        emailError.textContent = "Please enter a valid email address.";
        emailInput.style.border = "2px solid red";
        console.log("INVALID EMAIL - RED BORDER APPLIED:", emailInput.value);
        console.log("Border immediately after setting:", getComputedStyle(emailInput).borderColor);

    } else {

        emailError.textContent = "";
        emailInput.style.border = "2px solid green";

    }

});
clearDataButton.addEventListener("click", function() {

    localStorage.removeItem("registeredEmails");

    alert("Test registration data cleared successfully!");

});

registrationForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    let customerName = document.getElementById("name").value.trim();
    let formattedName = customerName.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    let customerEmail = document.getElementById("email").value.trim();
    let registeredEmails = JSON.parse(
    localStorage.getItem("registeredEmails")
) || [];

if (registeredEmails.includes(customerEmail.toLowerCase())) {
    document.getElementById("message").textContent = "This email is already registered!";

    return;
}

    let customerLanguage = document.getElementById("language").value;
    let namePattern = /^[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u;

if (customerName === "") {

    document.getElementById("message").textContent =
        "Please enter your name.";

    return;

} else if (!namePattern.test(customerName)) {

    document.getElementById("message").textContent =
        "Please enter a valid name using letters only.";

    return;

}
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(customerEmail)) {

    document.getElementById("message").textContent = "Please enter a valid email address.";

    return;
}
    
    let customer = {
    name: formattedName,
    email: customerEmail,
    language: customerLanguage
    };

    console.log(customer);
    console.log(JSON.stringify(customer));
    try {
    registerButton.disabled = true;
    registerButton.textContent = "Processing...";
    let response = await fetch("https://pranesh500.app.n8n.cloud/webhook/9b2c3af4-78c2-46d9-9ee3-2ea85f9df5d2", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
    });


    // YOUR IF-ELSE BLOCK STARTS HERE

    if (response.ok) {

        console.log("Registration successful!");

        if (customerLanguage === "English") {

            document.getElementById("message").textContent =
                "Welcome, " + formattedName +
                "! Registration received. Processing your welcome email...";

        } else {

            document.getElementById("message").textContent =
                "வணக்கம், " + formattedName +
                "! உங்கள் பதிவு பெறப்பட்டது. வரவேற்பு மின்னஞ்சல் தயாராகிறது.";

        }
       registeredEmails.push(customerEmail.toLowerCase());

localStorage.setItem(
    "registeredEmails",
    JSON.stringify(registeredEmails)
);
        registrationForm.reset();

    } else {

        console.log("Something went wrong!");

        document.getElementById("message").textContent =
            "Registration could not be processed. Please try again.";

    }

    // YOUR IF-ELSE BLOCK ENDS HERE

} catch (error) {

    console.log("Something went wrong:", error);

    document.getElementById("message").textContent =
        "Oops! Something went wrong. Please try again.";
        } finally {

    registerButton.disabled = false;
    registerButton.textContent = "Register";

}
    console.log(customerName);
    console.log(customerEmail);
    console.log(customerLanguage);
  

    alert("Registration button clicked!");
});
