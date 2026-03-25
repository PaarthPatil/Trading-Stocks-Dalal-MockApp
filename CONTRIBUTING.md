# 🤝 Contributing to Stock Simulation Platform

Thank you for your interest in contributing! This guide will help you get started.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

---

## 🌟 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Expected Behavior

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Offensive comments
- Trolling or insulting
- Publishing others' private information

---

## 🚀 Getting Started

### 1. Fork the Repository

```bash
# Click "Fork" button on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/stock-simulation.git
cd stock-simulation
```

### 2. Setup Development Environment

```bash
# Install dependencies (backend)
cd backend
npm install

# Install dependencies (frontend)
cd ../frontend
npm install

# Create .env files
cp .env.example .env  # In both directories
```

### 3. Create Branch

```bash
# Always branch from main
git checkout main

# Create feature branch
git checkout -b feature/amazing-feature
```

**Branch Naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Tests

---

## 💻 Development Workflow

### Make Changes

1. Edit code in your branch
2. Test thoroughly
3. Follow coding standards
4. Add comments where needed

### Run Locally

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Test Your Changes

**Manual Testing Checklist:**
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Works with different user roles
- [ ] Real-time updates work
- [ ] Error handling works

---

## 📝 Coding Standards

### JavaScript/Node.js (Backend)

**Style Guide:**
- Use 2 spaces for indentation
- Semicolons required
- Single quotes for strings
- ES6+ features encouraged
- Async/await over promises

**Example:**
```javascript
/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise<object>} User data
 */
async function getUserById(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  
  if (!user[0][0]) {
    throw new Error('User not found');
  }

  return user[0][0];
}
```

### React (Frontend)

**Component Structure:**
```jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Dashboard Component
 * Displays stock listings with real-time updates
 */
export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      setLoading(true);
      // Fetch stocks
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Content */}
    </div>
  );
}
```

**Best Practices:**
- Use functional components with hooks
- Destructure props
- Use PropTypes or TypeScript
- Keep components small and focused
- Extract reusable logic to custom hooks

### CSS/Tailwind

**Class Ordering:**
```jsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  {/* Layout → Spacing → Visual → Interactive */}
</div>
```

**Order Pattern:**
1. Layout (`flex`, `grid`, `block`)
2. Spacing (`p-4`, `m-2`, `space-x-4`)
3. Visual (`bg-white`, `rounded`, `shadow`)
4. Interactive (`hover:`, `focus:`, `active:`)

---

## 📋 Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, no code change
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance, config

### Examples

```bash
# Good commits
git commit -m "feat(dashboard): add real-time price updates"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(trades): simplify trade execution logic"

# Bad commits
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "asdfasdf"
```

### Writing Good Commit Messages

✅ **DO:**
- Use present tense ("add feature" not "added feature")
- Be concise but descriptive
- Reference issues/PRs when applicable

❌ **DON'T:**
- Use vague messages like "fix bug"
- Write essays in the subject line
- Include unrelated changes in one commit

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run final tests**
   - Backend starts without errors
   - Frontend builds successfully
   - No console warnings

3. **Review your changes**
   ```bash
   git diff main
   ```

### Creating PR

1. **Push to GitHub**
   ```bash
   git push origin feature/amazing-feature
   ```

2. **Open Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select base: `main`
   - Select compare: `feature/amazing-feature`

3. **Fill PR Template**

**Title:** Clear and descriptive

**Description:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All features work as expected
- [ ] No regressions introduced

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Fixes #123
```

### Review Process

1. **Automated Checks**
   - Wait for CI/CD to complete
   - Fix any failures

2. **Maintainer Review**
   - Address feedback
   - Make requested changes
   - Be patient (may take time)

3. **Approval & Merge**
   - Once approved, maintainer will merge
   - Delete your branch after merge

---

## 🐛 Issue Reporting

### Before Creating Issue

- Search existing issues (closed/open)
- Check if it's already fixed in main branch
- Gather necessary information

### Issue Template

```markdown
**Describe the bug**
Clear description of what the bug is

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.x]
- npm version: [e.g., 9.x]

**Additional context**
Any other details
```

### Issue Labels

Issues will be labeled appropriately:
- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Docs need improvement
- `good first issue` - Good for beginners
- `help wanted` - Extra attention needed

---

## 💡 Feature Requests

### Submitting Ideas

1. **Check existing requests**
   - Avoid duplicates
   - Comment on related issues

2. **Create Feature Request**

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Any other details, mockups, etc.
```

### Feature Evaluation

Features are evaluated based on:
- Alignment with project goals
- Impact on users
- Implementation complexity
- Maintenance burden

---

## 🔍 Code Review Guidelines

### For Contributors

- Be open to feedback
- Don't take criticism personally
- Ask questions if unclear
- Respond promptly to reviews

### For Reviewers

- Be constructive and kind
- Explain reasoning
- Suggest alternatives
- Acknowledge good work

---

## 📚 Resources

### Learning Materials

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Git Documentation](https://git-scm.com/docs)

### Tools

- **VS Code** - Recommended editor
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Postman** - API testing

---

## 🎯 Areas Needing Contribution

### High Priority

- Unit tests for backend
- Integration tests
- Performance optimization
- Accessibility improvements
- Mobile UI enhancements

### Nice to Have

- Dark mode theme
- Advanced charting options
- Social sharing features
- Email notifications
- Multi-language support

---

## 📞 Getting Help

### Communication Channels

- **GitHub Issues** - For bugs and features
- **GitHub Discussions** - For questions
- **Email** - your.email@example.com

### FAQ

**Q: How do I setup the database?**
A: See README.md Database Setup section

**Q: Why won't Socket.io connect?**
A: Check CORS configuration and JWT token validity

**Q: Can I add my own features?**
A: Yes! Just follow the contribution guidelines

---

## 🏆 Recognition

Contributors will be recognized in:
- CONTRIBUTORS file
- Release notes
- Project documentation

---

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Stock Simulation Platform!** 🎉

Your efforts help make this project better for everyone.
