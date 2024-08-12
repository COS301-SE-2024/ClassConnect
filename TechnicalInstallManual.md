# ClassConnect

## Technical Install Manual

### Prerequisites

* **Operating System:** Windows, macOS, or Linux.
* **Node.js and npm (or yarn):** Ensure Node.js is installed. npm (or yarn) is typically included with Node.js.
* **Git:** Installed and configured.
* **Text Editor:** A code editor like Visual Studio Code or Sublime Text.
* **Terminal or Command Prompt:** A terminal or command prompt to run commands.

### Installation Steps

#### 1. Clone the Repository

* Open your terminal or command prompt.
* Navigate to the desired directory where you want to clone the project.
* Use the following command to clone the repository:

```bash
  git clone git@github.com:COS301-SE-2024/ClassConnect.git
```

#### 2. Navigate to the Project Directory

* Open your terminal or command prompt and change the directory to the cloned project:

```bash
  cd src/client
```

#### 3. Install Bun

* BUn is used as the package manager for this project. Install Bun globally using npm:

```bash
  npm install -g bun
```

#### 4. Install Dependencies

* Use Bun to install the project dependencies:

```bash
  bun install
```

#### 5. Start the Development Server

* Run the development server:

```bash
  bun run dev
```

This will start a development server, typically at `http://localhost:5173`.

### Additional Notes

* **Environment Variables:** The application use environment variables in order to get access to them use Infisical with your login creditials, if the login fails please contact, the University of pretoria EBIT Department.
* **Database Setup:** The database is set up using a url provided in the in the `.env`.

### Troubleshooting

* **Dependency Issues:** If you encounter issues with dependencies, try running `bun install` again or checking the package manager's logs for errors.
* **Development Server Errors:** Inspect the terminal output for error messages. Common issues include port conflicts, missing dependencies, or incorrect configuration.
* **Browser Compatibility:** Ensure your browser is up-to-date and supports modern web technologies. It is recommended to use the latest version of Google Chrome, Microsoft Edge or Mozilla Firefox.

### Additional Considerations

* **Production Build:** To create a production-ready build, run `bun run build`.
* **Deployment:** Deployment is handled when a merge or push is made, no manual deployments are neccesary the process is completelty automated.
* **Code Linting:** Pretteir is used for lining to format the code run `bun run format` to lint run `bun run lint`.
* **Testing:** To test the code using the current test files use `bun run test`.
