import React, { useState } from 'react';
import styles from './CreateQuestionForm.module.css';

const API_URL = 'http://localhost:8000';

const CreateQuestionForm = () => {
  const [content, setContent] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [marks, setMarks] = useState(1);
  const [options, setOptions] = useState([{ content: '', is_correct: false }]); // Start with one option
  const [tags, setTags] = useState([]); // To manage tags

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { content: '', is_correct: false }]);
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTags([...tags, value]);
    } else {
      setTags(tags.filter(tag => tag !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const questionData = {
      content,
      question_type: questionType,
      marks,
      options: options.filter(option => option.content.trim() !== ''), // Include only non-empty options
      tags, // Assuming you send tag IDs or names directly
    };

    console.log('Sending data:', questionData);

    try {
      const response = await fetch(`${API_URL}/questions/questions/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(questionData),
      });

      const result = await response.json();
      console.log('Response JSON:', result);

      if (!response.ok) {
        console.error('Failed to create question:', result);
        throw new Error('Failed to create question');
      }

      console.log('Question created:', result);

      // Reset form
      setContent('');
      setQuestionType('MCQ');
      setMarks(1);
      setOptions([{ content: '', is_correct: false }]);
      setTags([]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Question Content:</label>
          <input 
            type="text" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label>Question Type:</label>
          <select 
            value={questionType} 
            onChange={(e) => setQuestionType(e.target.value)} 
            required
          >
            <option value="MCQ">Multiple Choice</option>
            <option value="True">True</option>
            <option value="False">False</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Marks:</label>
          <input 
            type="number" 
            value={marks} 
            onChange={(e) => setMarks(e.target.value)} 
            required 
          />
        </div>

        {questionType === 'MCQ' && (
          <div className={styles.inputGroup}>
            <label>Options:</label>
            {options.map((option, index) => (
              <div key={index} className={styles.optionGroup}>
                <input 
                  type="text" 
                  value={option.content} 
                  onChange={(e) => handleOptionChange(index, 'content', e.target.value)} 
                  placeholder={`Option ${index + 1}`} 
                  required 
                />
                <label>
                  <input 
                    type="checkbox" 
                    checked={option.is_correct} 
                    onChange={(e) => handleOptionChange(index, 'is_correct', e.target.checked)} 
                  />
                  Correct Answer
                </label>
              </div>
            ))}
            <button type="button" onClick={addOption}>Add Option</button>
          </div>
        )}

        <div className={styles.inputGroup}>
          <label>Tags:</label>
          {/* Assuming you have a predefined list of tags; otherwise, implement a dynamic solution */}
          <div className={styles.tagGroup}>
            <label>
              <input 
                type="checkbox" 
                value="Tag1" 
                onChange={handleTagChange} 
              />
              Tag 1
            </label>
            <label>
              <input 
                type="checkbox" 
                value="Tag2" 
                onChange={handleTagChange} 
              />
              Tag 2
            </label>
            {/* Add more tag options as needed */}
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>Create Question</button>
      </form>
    </div>
  );
};

export default CreateQuestionForm;
