//c// SUPABASE CONNECTION
const SUPABASE_URL = "https://yotxhnqienfkzozozdac.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_bcFs3yr8QcC6Hc0v1WIdsA_o_vGDdnl";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            document.getElementById("message").textContent =
                error.message;
            return;
        }

        console.log("Login successful!", data.user);

        document.getElementById("message").textContent =
            "Login successful! Welcome back!";

        window.location.href = "dashboard.html";

    } catch (error) {

        console.log(error);

        document.getElementById("message").textContent =
            "Something went wrong. Please try again.";

    } finally {

        loginButton.disabled = false;
        loginButton.textContent = "Login";

    }

});