import { supabase } from "../../backend/SupabaseClient.js";

/**
 * Handles user login with Supabase and stores user ID in localStorage.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<{data?: object, error?: object}>}
 */
export async function handleLogin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.user) {
        return { error: error || new Error("No user returned from login") };
    } else {
        localStorage.setItem("userId", data.user.id);
        return { data };
    }
}

/**
 * Handles user signup with Supabase and stores user ID in localStorage after signup.
 * @param {string} email
 * @param {string} password
 * @param {object} options (userType, name)
 * @returns {Promise<{data?: object, error?: object}>}
 */
export async function handleSignup(email, password, options) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: options }
    });
    if (error || !data?.user) {
        return { error: error || new Error("No user returned from signup") };
    } else {
        localStorage.setItem("userId", data.user.id);
        return { data };
    }
}