import { 
  getPersonalRoadblockQuestions,
  getUserPersonalRoadblocks,
  saveUserPersonalRoadblock,
  deleteUserPersonalRoadblock,
  createPersonalRoadblockQuestion,
  updatePersonalRoadblockQuestion,
  deletePersonalRoadblockQuestion
} from '../services/personalRoadblocksService.js';

// Get personal roadblock questions for the Roadblocks page
export async function getPersonalRoadblockQuestionsContent(req, res, next) {
  try {
    const questions = await getPersonalRoadblockQuestions();
    
    res.json({
      questions
    });
  } catch (err) {
    next(err);
  }
}

// Get user's personal roadblock responses
export async function getUserPersonalRoadblocksContent(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    
    const responses = await getUserPersonalRoadblocks(userId);
    
    res.json({
      responses
    });
  } catch (err) {
    next(err);
  }
}

// Save user's personal roadblock response
export async function saveUserPersonalRoadblockResponse(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    
    const { questionId, response } = req.body;
    
    if (!questionId || !response) {
      return res.status(400).json({ error: 'Question ID and response are required' });
    }
    
    const savedResponse = await saveUserPersonalRoadblock(userId, questionId, response);
    
    res.json(savedResponse);
  } catch (err) {
    next(err);
  }
}

// Delete user's personal roadblock response
export async function deleteUserPersonalRoadblockResponse(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    
    const { questionId } = req.params;
    
    const deletedResponse = await deleteUserPersonalRoadblock(userId, questionId);
    
    if (!deletedResponse) return res.status(404).json({ error: 'Response not found' });
    
    res.json({ message: 'Response deleted successfully', deletedResponse });
  } catch (err) {
    next(err);
  }
}

// Admin functions for managing questions
export async function getPersonalRoadblockQuestionsList(req, res, next) {
  try {
    const questions = await getPersonalRoadblockQuestions();
    res.json({ questions });
  } catch (err) {
    next(err);
  }
}

export async function createPersonalRoadblockQuestionItem(req, res, next) {
  try {
    const question = await createPersonalRoadblockQuestion(req.body);
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
}

export async function updatePersonalRoadblockQuestionItem(req, res, next) {
  try {
    const { id } = req.params;
    const question = await updatePersonalRoadblockQuestion(id, req.body);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (err) {
    next(err);
  }
}

export async function deletePersonalRoadblockQuestionItem(req, res, next) {
  try {
    const { id } = req.params;
    const question = await deletePersonalRoadblockQuestion(id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json({ message: 'Question deleted successfully', question });
  } catch (err) {
    next(err);
  }
}
