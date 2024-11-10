import {api} from "boot/axios";

// Get user details
export async function getMe() {
  const response = await api.get("auth/me");
  return response.data.user;
}

// Update Username
export async function updateUsername(name) {
  const response = await api.post("me/update-username", {
    name: name,
  });
  return response.data;
}

// Update Email (requires email and password)
export async function updateEmail(email, password) {
  const response = await api.post("me/update-email", {
    email: email,
    password: password,
  });
  return response.data;
}

// Update Password (requires current password and new password)
export async function updatePassword(newPassword, password) {
  const response = await api.post("me/update-password", {
    password: password,
    new_password: newPassword,
    new_password_confirmation: newPassword
  });
  return response.data;
}

// Update Two-Factor Authentication (TFA)
export async function updateTfa(tfa) {
  const response = await api.post("me/update-tfa", {
    tfa: tfa,
  });
  return response.data;
}
