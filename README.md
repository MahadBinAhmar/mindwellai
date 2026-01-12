# MindWell AI

**Simple mental health web app (static front-end)**

A small static web project built with HTML, CSS, and JavaScript. You can open it directly in your browser or run a local server for development.

## ⚡ Features
- Multiple pages: Home, Assessment, Booking, Chat, Checkout, Dashboard, Feedback, Login, Register, Profile setup, Therapists
- Front-end JavaScript in the `js/` folder
- Styles in `styles/styles.css`
- Static assets in `assets/`

---

## 🔧 Run locally
1. Open the project folder:

```bash
cd path/to/mindwellai
```

2. Open `index.html` directly in your browser, or run a local server (recommended):

```bash
# With Python 3 (serves on port 8000)
python -m http.server 8000
# Then open: http://localhost:8000
```

---

## 📤 Upload to GitHub (Windows)

### Method A — GitHub web (easiest if you don't use Git locally)
1. Log in to GitHub and create a new repository.
2. Upload your project files or a ZIP archive using the web interface.

### Method B — Git command line (recommended)

```bash
# 1. Initialize local repo
cd path/to/mindwellai
git init

git add .
git commit -m "Initial commit"

# 2. Add GitHub remote (replace placeholders)
git remote add origin https://github.com/<your-username>/<repo-name>.git
# or with SSH:
# git remote add origin git@github.com:<your-username>/<repo-name>.git

# 3. Rename default branch to main and push
git branch -M main
git push -u origin main
```

## Author
Find me on GitHub: [MahadBinAhmar](https://github.com/MahadBinAhmar)


### Method C — GitHub CLI (if `gh` is installed)

```bash
gh auth login
gh repo create <repo-name> --public --source=. --remote=origin --push
```

---

## 🌐 Publish with GitHub Pages
1. Go to your repository on GitHub → `Settings` → `Pages`.
2. Choose branch `main` and folder `/ (root)` then Save.
3. The site will be available after a few minutes at: `https://<your-username>.github.io/<repo-name>/`

---

## 📁 Example `.gitignore`
- `node_modules/`
- `*.log`
- `.env`
- `dist/`
- `.DS_Store`

---

## 🤝 Contributing
If you make changes or fixes, please create a new branch, commit your changes, and open a Pull Request.

---

## 📄 License
Add a license that fits your project (for example, `MIT`).

---

If you want, I can create the GitHub repository and push the project for you — tell me your GitHub username and the repository name, or I can provide the exact commands for you to run locally.