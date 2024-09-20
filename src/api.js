const API_URL = 'http://localhost:8000/'; // Your Django API base URL

// Function to handle user login
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json(); 
    const { access, refresh, role, user_id } = data; // Assuming your API returns these

    // Store tokens and ID based on user role
    localStorage.setItem('authToken', access);
    localStorage.setItem('refreshToken', refresh);

    if (role === 'student') {
      localStorage.setItem('studentId', user_id); // Store student ID for students
    } else if (role === 'teacher') {
      localStorage.setItem('teacherId', user_id); // Store teacher ID for teachers
    }

    return data; // Return the data if you need it for further use
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to handle user registration
export const register = async (username, password, role) => {
  try {
    const response = await fetch(`${API_URL}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json(); 
    const { user_id, access, refresh } = data; // Assuming your API returns these

    // Store tokens and ID based on user role
    localStorage.setItem('authToken', access);
    localStorage.setItem('refreshToken', refresh);

    if (role === 'student') {
      localStorage.setItem('studentId', user_id); // Store student ID for students
    } else if (role === 'teacher') {
      localStorage.setItem('teacherId', user_id); // Store teacher ID for teachers
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
