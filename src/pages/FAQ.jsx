import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ExpandMore,
  Search,
  Add,
  WorkOutline,
  AttachMoney,
  AccessTime,
  HealthAndSafety,
  Edit,
  Delete,
} from '@mui/icons-material';

function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [faqs, setFaqs] = useState([
    {
      category: 'Employment',
      questions: [
        {
          q: "What documents do I need for onboarding?",
          a: "You'll need your ID, work authorization, tax forms, and banking information for direct deposit."
        },
        {
          q: "How do I request a change to my personal information?",
          a: "Submit updates through the Employee Hub or contact HR directly."
        }
      ]
    },
    {
      category: 'Payroll',
      questions: [
        {
          q: "When are paydays?",
          a: "Payroll is processed bi-weekly, every other Friday."
        },
        {
          q: "What should I do if I notice a discrepancy in my pay?",
          a: "Contact your supervisor or HR immediately with documentation of the discrepancy."
        }
      ]
    },
    {
      category: 'Leave',
      questions: [
        {
          q: "How do I request time off?",
          a: "Submit requests through the Employee Hub with at least two weeks' notice."
        },
        {
          q: "What is the maternity leave policy?",
          a: "Eligible employees receive 12 weeks of paid maternity leave."
        }
      ]
    }
  ]);
  const [editDialog, setEditDialog] = useState({ open: false, category: '', questionIndex: -1 });
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');
  const [newFaqDialog, setNewFaqDialog] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    category: '',
    question: '',
    answer: ''
  });

  const categories = [
    { name: 'All', icon: null },
    { name: 'Employment', icon: <WorkOutline /> },
    { name: 'Payroll', icon: <AttachMoney /> },
    { name: 'Leave', icon: <AccessTime /> },
    { name: 'Health & Safety', icon: <HealthAndSafety /> }
  ];

  const handleDelete = (categoryIndex, questionIndex) => {
    const newFaqs = [...faqs];
    newFaqs[categoryIndex].questions.splice(questionIndex, 1);
    // Remove category if it has no questions
    if (newFaqs[categoryIndex].questions.length === 0) {
      newFaqs.splice(categoryIndex, 1);
    }
    setFaqs(newFaqs);
  };

  const handleEdit = (categoryIndex, questionIndex) => {
    const question = faqs[categoryIndex].questions[questionIndex];
    setEditedQuestion(question.q);
    setEditedAnswer(question.a);
    setEditDialog({
      open: true,
      category: categoryIndex,
      questionIndex: questionIndex
    });
  };

  const handleSaveEdit = () => {
    const newFaqs = [...faqs];
    newFaqs[editDialog.category].questions[editDialog.questionIndex] = {
      q: editedQuestion,
      a: editedAnswer
    };
    setFaqs(newFaqs);
    setEditDialog({ open: false, category: '', questionIndex: -1 });
  };

  const handleAddNewFaq = () => {
    if (!newQuestion.category || !newQuestion.question || !newQuestion.answer) {
      return;
    }

    const newFaqs = [...faqs];
    const categoryIndex = newFaqs.findIndex(c => c.category === newQuestion.category);

    if (categoryIndex >= 0) {
      // Add to existing category
      newFaqs[categoryIndex].questions.push({
        q: newQuestion.question,
        a: newQuestion.answer
      });
    } else {
      // Create new category
      newFaqs.push({
        category: newQuestion.category,
        questions: [{
          q: newQuestion.question,
          a: newQuestion.answer
        }]
      });
    }

    setFaqs(newFaqs);
    setNewFaqDialog(false);
    setNewQuestion({ category: '', question: '', answer: '' });
  };

  const handleCloseNewDialog = () => {
    setNewFaqDialog(false);
    setNewQuestion({ category: '', question: '', answer: '' });
  };

  const filteredFAQs = faqs
    .filter(category => 
      selectedCategory === 'All' || category.category === selectedCategory
    )
    .map(category => ({
      ...category,
      questions: category.questions.filter(qa =>
        qa.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qa.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.questions.length > 0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>FAQ & Knowledge Base</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="medium"
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            startIcon={<Add />}
            fullWidth
            onClick={() => setNewFaqDialog(true)}
            sx={{ 
              height: '56px', // Match height of TextField
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Add New FAQ
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {categories.map((category) => (
          <Chip
            key={category.name}
            label={category.name}
            icon={category.icon}
            onClick={() => setSelectedCategory(category.name)}
            variant={selectedCategory === category.name ? 'filled' : 'outlined'}
            color={selectedCategory === category.name ? 'primary' : 'default'}
          />
        ))}
      </Box>

      <Paper sx={{ p: 3 }}>
        {filteredFAQs.map((category, categoryIndex) => (
          <Box key={category.category}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {category.category}
            </Typography>
            {category.questions.map((qa, questionIndex) => (
              <Accordion key={questionIndex} sx={{ mb: 1 }}>
                <AccordionSummary 
                  expandIcon={<ExpandMore />}
                  sx={{ 
                    '& .MuiAccordionSummary-content': { 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pr: 2 
                    }
                  }}
                >
                  <Typography sx={{ flex: 1 }}>{qa.q}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(categoryIndex, questionIndex);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(categoryIndex, questionIndex);
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    {qa.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
            <Divider sx={{ my: 3 }} />
          </Box>
        ))}
      </Paper>

      <Dialog 
        open={newFaqDialog} 
        onClose={handleCloseNewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New FAQ</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Category"
            value={newQuestion.category}
            onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select a category</option>
            {categories
              .filter(cat => cat.name !== 'All')
              .map(cat => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))
            }
          </TextField>
          <TextField
            autoFocus
            margin="normal"
            label="Question"
            fullWidth
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
          />
          <TextField
            margin="normal"
            label="Answer"
            fullWidth
            multiline
            rows={4}
            value={newQuestion.answer}
            onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewDialog}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddNewFaq} 
            variant="contained"
            disabled={!newQuestion.category || !newQuestion.question || !newQuestion.answer}
          >
            Add FAQ
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, category: '', questionIndex: -1 })}>
        <DialogTitle>Edit FAQ Entry</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question"
            fullWidth
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Answer"
            fullWidth
            multiline
            rows={4}
            value={editedAnswer}
            onChange={(e) => setEditedAnswer(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, category: '', questionIndex: -1 })}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FAQ; 