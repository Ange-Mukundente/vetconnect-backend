// services/authservice.ts
export const registerUser = async (userData: any) => {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Network error or server not reachable.",
    };
  }
};

export const loginUser = async (credentials: any) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Network error or server not reachable.",
    };
  }
};
