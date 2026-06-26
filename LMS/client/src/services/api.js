// API Service with high-quality LocalStorage fallback engine
const API_URL = "http://localhost:5000/api";

// Initialize mock data in LocalStorage if not present
const initMockDB = () => {
  if (!localStorage.getItem("lms_db_users")) {
    const defaultUsers = [
      { id: "u1", name: "Rahul Sharma", email: "rahul@example.com", password: "password123", role: "employee", leaveBalance: 20 },
      { id: "u2", name: "Priya Singh", email: "priya@example.com", password: "password123", role: "employee", leaveBalance: 24 },
      { id: "u3", name: "Amit Kumar", email: "admin@example.com", password: "password123", role: "admin", leaveBalance: 0 }
    ];
    localStorage.setItem("lms_db_users", JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem("lms_db_leaves")) {
    const defaultLeaves = [
      {
        id: "l1",
        employeeId: "u1",
        employeeName: "Rahul Sharma",
        fromDate: "2026-07-10",
        toDate: "2026-07-12",
        days: 3,
        reason: "Family Function",
        status: "PENDING",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: "l2",
        employeeId: "u2",
        employeeName: "Priya Singh",
        fromDate: "2026-07-20",
        toDate: "2026-07-21",
        days: 2,
        reason: "Medical Leave",
        status: "APPROVED",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: "l3",
        employeeId: "u1",
        employeeName: "Rahul Sharma",
        fromDate: "2026-07-25",
        toDate: "2026-07-25",
        days: 1,
        reason: "Personal Work",
        status: "REJECTED",
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
      }
    ];
    localStorage.setItem("lms_db_leaves", JSON.stringify(defaultLeaves));
  }

  if (!localStorage.getItem("lms_db_notifications")) {
    const defaultNotifications = [
      { id: "n1", userId: "u1", message: "Your leave request for 2026-07-25 was rejected.", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: "n2", userId: "u2", message: "Your leave request for 2026-07-20 was approved!", read: false, createdAt: new Date(Date.now() - 1800000).toISOString() }
    ];
    localStorage.setItem("lms_db_notifications", JSON.stringify(defaultNotifications));
  }
};

initMockDB();

// Helper functions for localStorage fallback DB
const getLocalUsers = () => JSON.parse(localStorage.getItem("lms_db_users"));
const setLocalUsers = (users) => localStorage.setItem("lms_db_users", JSON.stringify(users));
const getLocalLeaves = () => JSON.parse(localStorage.getItem("lms_db_leaves"));
const setLocalLeaves = (leaves) => localStorage.setItem("lms_db_leaves", JSON.stringify(leaves));
const getLocalNotifications = () => JSON.parse(localStorage.getItem("lms_db_notifications")) || [];
const setLocalNotifications = (notifs) => localStorage.setItem("lms_db_notifications", JSON.stringify(notifs));

// HTTP Client options
const getHeaders = () => {
  const token = localStorage.getItem("lms_token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// Check if backend server is available
const checkBackend = async () => {
  try {
    const res = await fetch(`${API_URL}/health`, { method: "GET", timeout: 1000 }).catch(() => null);
    return res && res.ok;
  } catch {
    return false;
  }
};

// API calls with transparent fallback
export const login = async (email, password) => {
  const useBackend = await checkBackend();
  if (useBackend) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Invalid credentials");
    }
    return res.json();
  } else {
    // Local fallback
    const users = getLocalUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const cleanUser = { id: user.id, name: user.name, email: user.email, role: user.role, leaveBalance: user.leaveBalance };
    return { token: "mock-jwt-token-" + user.id, user: cleanUser };
  }
};

export const register = async (name, email, password, role = "employee") => {
  const useBackend = await checkBackend();
  if (useBackend) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Registration failed");
    }
    return res.json();
  } else {
    // Local fallback
    const users = getLocalUsers();
    if (users.find((u) => u.email === email)) {
      throw new Error("User already exists with this email");
    }
    const newUser = {
      id: "u_" + Date.now(),
      name,
      email,
      password,
      role,
      leaveBalance: role === "admin" ? 0 : 24,
    };
    users.push(newUser);
    setLocalUsers(users);
    const cleanUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, leaveBalance: newUser.leaveBalance };
    return { token: "mock-jwt-token-" + newUser.id, user: cleanUser };
  }
};

export const getLeaves = async () => {
  const useBackend = await checkBackend();
  if (useBackend) {
    const res = await fetch(`${API_URL}/leaves`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch leaves");
    return res.json();
  } else {
    // Local fallback
    const user = JSON.parse(localStorage.getItem("lms_user"));
    if (!user) throw new Error("Not authenticated");
    const leaves = getLocalLeaves();
    if (user.role === "admin") {
      return leaves;
    } else {
      return leaves.filter((l) => l.employeeId === user.id);
    }
  }
};

export const applyLeave = async (leaveData) => {
  const useBackend = await checkBackend();
  if (useBackend) {
    const res = await fetch(`${API_URL}/leaves`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(leaveData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to apply leave");
    }
    return res.json();
  } else {
    // Local fallback
    const user = JSON.parse(localStorage.getItem("lms_user"));
    if (!user) throw new Error("Not authenticated");

    const users = getLocalUsers();
    const userInDb = users.find((u) => u.id === user.id);
    if (!userInDb) throw new Error("User not found");

    if (userInDb.leaveBalance < leaveData.days) {
      throw new Error("Insufficient leave balance");
    }

    const leaves = getLocalLeaves();
    const newLeave = {
      id: "l_" + Date.now(),
      employeeId: user.id,
      employeeName: user.name,
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      days: leaveData.days,
      reason: leaveData.reason,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    leaves.push(newLeave);
    setLocalLeaves(leaves);

    // Notify admins
    const admins = users.filter((u) => u.role === "admin");
    const notifs = getLocalNotifications();
    admins.forEach((admin) => {
      notifs.push({
        id: "n_" + Date.now() + "_" + Math.random(),
        userId: admin.id,
        message: `${user.name} applied for ${leaveData.days} days of leave.`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    });
    setLocalNotifications(notifs);

    return newLeave;
  }
};

export const updateLeaveStatus = async (leaveId, status) => {
  const useBackend = await checkBackend();
  if (useBackend) {
    const res = await fetch(`${API_URL}/leaves/${leaveId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
  } else {
    // Local fallback
    const user = JSON.parse(localStorage.getItem("lms_user"));
    if (!user || user.role !== "admin") throw new Error("Unauthorized");

    const leaves = getLocalLeaves();
    const leaveIndex = leaves.findIndex((l) => l.id === leaveId);
    if (leaveIndex === -1) throw new Error("Leave request not found");

    const leave = leaves[leaveIndex];
    
    // Core logic: If approved, deduct leave balance
    if (status === "APPROVED" && leave.status !== "APPROVED") {
      const users = getLocalUsers();
      const empIndex = users.findIndex((u) => u.id === leave.employeeId);
      if (empIndex !== -1) {
        if (users[empIndex].leaveBalance < leave.days) {
          throw new Error("Employee does not have enough leave balance remaining");
        }
        users[empIndex].leaveBalance -= leave.days;
        setLocalUsers(users);
        
        // If current user is this employee, update local user session balance
        const currentUser = JSON.parse(localStorage.getItem("lms_user"));
        if (currentUser && currentUser.id === leave.employeeId) {
          currentUser.leaveBalance = users[empIndex].leaveBalance;
          localStorage.setItem("lms_user", JSON.stringify(currentUser));
        }
      }
    }

    leave.status = status;
    leaves[leaveIndex] = leave;
    setLocalLeaves(leaves);

    // Create notification for employee
    const notifs = getLocalNotifications();
    notifs.push({
      id: "n_" + Date.now(),
      userId: leave.employeeId,
      message: `Your leave request for ${leave.fromDate} to ${leave.toDate} has been ${status}.`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    setLocalNotifications(notifs);

    return leave;
  }
};

export const getNotifications = async () => {
  const useBackend = await checkBackend();
  if (useBackend) {
    const res = await fetch(`${API_URL}/notifications`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
  } else {
    // Local fallback
    const user = JSON.parse(localStorage.getItem("lms_user"));
    if (!user) return [];
    const notifs = getLocalNotifications();
    return notifs.filter((n) => n.userId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

export const markNotificationsAsRead = async () => {
  const useBackend = await checkBackend();
  if (useBackend) {
    await fetch(`${API_URL}/notifications/read`, { method: "PUT", headers: getHeaders() });
  } else {
    // Local fallback
    const user = JSON.parse(localStorage.getItem("lms_user"));
    if (!user) return;
    const notifs = getLocalNotifications();
    notifs.forEach((n) => {
      if (n.userId === user.id) n.read = true;
    });
    setLocalNotifications(notifs);
  }
};

export const getUserStats = async () => {
  const useBackend = await checkBackend();
  if (useBackend) {
    const res = await fetch(`${API_URL}/users/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  } else {
    // Local fallback
    const user = JSON.parse(localStorage.getItem("lms_user"));
    if (!user) throw new Error("Not authenticated");

    const users = getLocalUsers();
    const userInDb = users.find((u) => u.id === user.id);
    const leaves = getLocalLeaves();

    if (user.role === "admin") {
      const pending = leaves.filter((l) => l.status === "PENDING").length;
      const approved = leaves.filter((l) => l.status === "APPROVED").length;
      const rejected = leaves.filter((l) => l.status === "REJECTED").length;
      return {
        totalRequests: leaves.length,
        pendingRequests: pending,
        approvedRequests: approved,
        rejectedRequests: rejected
      };
    } else {
      const empLeaves = leaves.filter((l) => l.employeeId === user.id);
      const pending = empLeaves.filter((l) => l.status === "PENDING").length;
      const approved = empLeaves.filter((l) => l.status === "APPROVED").length;
      return {
        leaveBalance: userInDb ? userInDb.leaveBalance : 0,
        pendingLeaves: pending,
        approvedLeaves: approved,
      };
    }
  }
};
