const API_BASE_URL = 'http://localhost:5000/api';
const TOKEN_KEY = 'nsi_lms_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(response, defaultMsg) {
  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // Ignore invalid JSON error bodies.
    }
    throw new Error(errorData?.message || defaultMsg);
  }

  const json = await response.json();
  return json.data || [];
}

async function request(path, options = {}, defaultMsg = 'Request failed') {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: getAuthHeaders(),
    });
    return handleResponse(response, defaultMsg);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to LMS server. Please ensure the backend is running.');
    }
    throw error;
  }
}

function queryString(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'ALL') {
      params.append(key, value);
    }
  });
  return params.toString() ? `?${params.toString()}` : '';
}

export const getCourseCategories = (filters) =>
  request(`/admin/course-categories${queryString(filters)}`, {}, 'Failed to load course categories');

export const createCourseCategory = (data) =>
  request('/admin/course-categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }, 'Failed to create course category');

export const updateCourseCategory = (id, data) =>
  request(`/admin/course-categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, 'Failed to update course category');

export const updateCourseCategoryStatus = (id, status) =>
  request(`/admin/course-categories/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, 'Failed to update category status');

export const getCourses = (filters) =>
  request(`/admin/courses${queryString(filters)}`, {}, 'Failed to load courses');

export const createCourse = (data) =>
  request('/admin/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  }, 'Failed to create course');

export const updateCourse = (id, data) =>
  request(`/admin/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, 'Failed to update course');

export const updateCourseStatus = (id, status) =>
  request(`/admin/courses/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, 'Failed to update course status');

export const getCourseBatches = (courseId, filters) =>
  request(`/admin/courses/${courseId}/batches${queryString(filters)}`, {}, 'Failed to load batches');

export const createCourseBatch = (courseId, data) =>
  request(`/admin/courses/${courseId}/batches`, {
    method: 'POST',
    body: JSON.stringify(data),
  }, 'Failed to create batch');

export const updateCourseBatch = (id, data) =>
  request(`/admin/batches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, 'Failed to update batch');

export const updateCourseBatchStatus = (id, status) =>
  request(`/admin/batches/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, 'Failed to update batch status');

export const getBatchInstructors = (batchId) =>
  request(`/admin/batches/${batchId}/instructors`, {}, 'Failed to load batch instructors');

export const assignBatchInstructor = (batchId, instructorId) =>
  request(`/admin/batches/${batchId}/instructors`, {
    method: 'POST',
    body: JSON.stringify({ instructor_id: instructorId }),
  }, 'Failed to assign instructor');

export const updateBatchInstructorStatus = (batchId, instructorId, status) =>
  request(`/admin/batches/${batchId}/instructors/${instructorId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, 'Failed to update instructor assignment');

export const removeBatchInstructor = (batchId, instructorId) =>
  request(`/admin/batches/${batchId}/instructors/${instructorId}`, {
    method: 'DELETE',
  }, 'Failed to remove instructor assignment');

export const getBatchStudents = (batchId) =>
  request(`/admin/batches/${batchId}/students`, {}, 'Failed to load batch students');

export const enrollBatchStudent = (batchId, studentId) =>
  request(`/admin/batches/${batchId}/students`, {
    method: 'POST',
    body: JSON.stringify({ student_id: studentId }),
  }, 'Failed to enroll student');

export const updateBatchStudentStatus = (batchId, studentId, status) =>
  request(`/admin/batches/${batchId}/students/${studentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, 'Failed to update student enrollment');

export const removeBatchStudent = (batchId, studentId) =>
  request(`/admin/batches/${batchId}/students/${studentId}`, {
    method: 'DELETE',
  }, 'Failed to remove student enrollment');
