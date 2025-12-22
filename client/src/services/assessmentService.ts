const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface AssessmentQuestion {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'checkboxes' | 'short_text' | 'long_text';
  options: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: 'fivea' | 'fagerstrom';
  metadata: {
    step: 'ask' | 'advise' | 'assess' | 'assist' | 'arrange';
    tobacco_category: 'smoked' | 'smokeless';
  };
}

export interface CreateAssessmentQuestionRequest {
  question_text: string;
  options: string[];
  step: 'ask' | 'advise' | 'assess' | 'assist' | 'arrange';
  tobacco_category: 'smoked' | 'smokeless';
}

export interface UpdateAssessmentQuestionRequest {
  question_text?: string;
  options?: string[];
  step?: 'ask' | 'advise' | 'assess' | 'assist' | 'arrange';
  tobacco_category?: 'smoked' | 'smokeless';
  is_active?: boolean;
}

// Get all questions for a specific step and tobacco category
export async function getAssessmentQuestions(
  step: string,
  tobaccoCategory: 'smoked' | 'smokeless' = 'smoked',
  includeInactive: boolean = false
): Promise<{ questions: AssessmentQuestion[] }> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(
    `${API_BASE_URL}/admin/assessment/questions?step=${step}&tobacco_category=${tobaccoCategory}&include_inactive=${includeInactive}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch assessment questions");
  }
  return res.json();
}

// Get all 5A questions (all steps, all categories)
export async function getAllAssessmentQuestions(
  includeInactive: boolean = false
): Promise<{ questions: AssessmentQuestion[] }> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(
    `${API_BASE_URL}/admin/assessment/questions?category=fivea&include_inactive=${includeInactive}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch all assessment questions");
  }
  return res.json();
}

// Get Fagerström questions filtered by tobacco category
export async function getFagerstromQuestions(
  tobaccoCategory: 'smoked' | 'smokeless',
  includeInactive: boolean = false
): Promise<{ questions: AssessmentQuestion[] }> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(
    `${API_BASE_URL}/admin/assessment/questions?category=fagerstrom&tobacco_category=${tobaccoCategory}&include_inactive=${includeInactive}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Fagerström questions");
  }
  return res.json();
}

// Get all Fagerström questions (both tobacco categories)
export async function getAllFagerstromQuestions(
  includeInactive: boolean = false
): Promise<{ questions: AssessmentQuestion[] }> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(
    `${API_BASE_URL}/admin/assessment/questions?category=fagerstrom&include_inactive=${includeInactive}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch all Fagerström questions");
  }
  return res.json();
}

// Create a new assessment question
export async function createAssessmentQuestion(
  data: CreateAssessmentQuestionRequest
): Promise<AssessmentQuestion> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_BASE_URL}/admin/assessment/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create assessment question");
  }
  return res.json();
}

// Update an assessment question
export async function updateAssessmentQuestion(
  id: number,
  data: UpdateAssessmentQuestionRequest
): Promise<AssessmentQuestion> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_BASE_URL}/admin/assessment/questions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update assessment question");
  }
  return res.json();
}

// Soft delete an assessment question
export async function softDeleteAssessmentQuestion(id: number): Promise<void> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(
    `${API_BASE_URL}/admin/assessment/questions/${id}/soft-delete`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete assessment question");
  }
}

// Hard delete an assessment question
export async function deleteAssessmentQuestion(id: number): Promise<void> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(
    `${API_BASE_URL}/admin/assessment/questions/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete assessment question");
  }
}

// Get a single assessment question by ID
export async function getAssessmentQuestionById(
  id: number
): Promise<AssessmentQuestion> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(
    `${API_BASE_URL}/admin/assessment/questions/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch assessment question");
  }
  return res.json();
}
