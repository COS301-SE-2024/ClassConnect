# Class Connect

To maintain a structured and efficient workflow, we follow the GitFlow branching strategy. Please adhere to the guidelines below to ensure smooth collaboration and high-quality code.

## Table of Contents

1. [Introduction](#introduction)
2. [Branches](#branches)
   - [Main Branch](#main-branch)
   - [Develop Branch](#develop-branch)
   - [Feature Branches](#feature-branches)
3. [Workflow](#workflow)
4. [Best Practices](#best-practices)
5. [Pull Request Process](#pull-request-process)

## Introduction

In modern software development, effective version control is crucial for managing complex projects and collaborating with team members. We use GitFlow to manage our branches within a Git repository, facilitating parallel development, release management, and collaboration.

## Branches

### Main Branch

- The `main` branch is the primary branch reflecting the latest delivered development changes.
- It is only interacted with after a successful deployment from the `develop` branch.
- Post-deployment, `develop` and `main` are merged, and `main` is tagged with a release number (e.g., `v1`, `v1.1`).

### Develop Branch

- The `develop` branch is the main branch for new features, additions, and fixes.
- All features are merged here before being released to production.
- It reflects a snapshot of the next release and is considered relatively stable.
- Continuous integration (CI) practices are used to automate testing and integration.

### Feature Branches

- Branch off from `develop` for new features, bug fixes, or updates.
- Naming conventions:
  - Features: `feature/<name-of-feature>`
  - Bugs: `bug/<name-of-bug>`
  - Updates: `update/<name-of-update>`
- Keep names concise yet descriptive.
- Feature branches are unstable as they represent work in progress.
- After completion, create a pull request to `develop` and delete the branch post-merge.

## Workflow

### Setting Up Milestone and Issues

1. **Create Milestone on GitHub**: Start by setting a milestone (e.g., "Login Page").
2. **Create Issues**: Under the milestone, create issues for each task (e.g., frontend, backend, integration, documentation, testing, automation).

### Development Process

1. **Frontend Development**:
   - Create branch: `feature/login-frontend` from `develop`.
   - Complete frontend, document the code, and close issues.

2. **Backend Development**:
   - Create branch: `feature/login-backend` from `develop`.
   - Complete backend development, document the code, and close issues.

3. **Integration**:
   - Create branch: `feature/login-integration` from `develop`.
   - Integrate frontend with the authentication service, write integration tests, and close issues.

4. **Testing**:
   - Create branch: `feature/login-testing` from `develop`.
   - Execute tests, expand as necessary, and close the testing issue.

5. **Automation**:
   - Create branch: `feature/login-automation` from `develop`.
   - Automate tests, ensure all issues are closed, and merge `develop` with `main`.

## Best Practices

- Ensure all feature branches are thoroughly tested and meet project quality standards before merging.
- Maintain stability in the `develop` branch by catching issues early with CI.
- Use descriptive and concise branch names.
- Document code and tasks diligently.

## Pull Request Process

1. **Create Pull Request**:
   - From your feature branch to `develop`.
   - Include a detailed description of changes and link related issues.

2. **Review**:
   - At least 2 team members, including the project leader, must review the pull request.

3. **Merge**:
   - After approval and passing CI checks, merge the feature branch into `develop`.

4. **Delete Branch**:
   - Post-merge, delete the feature branch to keep the repository clean.

By following these guidelines, we ensure an organized and efficient workflow, fostering collaboration and maintaining high standards for our project's development.
