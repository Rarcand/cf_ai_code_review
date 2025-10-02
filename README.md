# cf_ai_code_review
# AI Code Reviewer on Cloudflare

![Cloudflare Workers AI](https://img.shields.io/badge/Powered%20By-Cloudflare%20Workers%20AI-F38020?style=for-the-badge&logo=cloudflare)
![Cloudflare Pages](https://img.shields.io/badge/Deployed%20On-Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare)

An AI-powered application built on the Cloudflare stack that provides intelligent reviews for code snippets. This project was created to fulfill the requirements of the Cloudflare AI app assignment.

---

## Live Demo

**You can view and test the live application here:**

### **https://cf-ai-code-review.pages.dev/**

---

## Project Description

A user can paste a block of code (in JavaScript, Python, HTML, or Rust), and the application sends it to a Large Language Model (Llama 3.3 via Workers AI) to perform a detailed analysis. The AI checks for bugs, style issues, and potential improvements, and returns a formatted review.

## Features

-   **AI-Powered Analysis:** Uses Llama 3.3 via Cloudflare Workers AI for code reviews.
-   **Markdown Rendering:** The AI's response is parsed from Markdown and rendered as clean, formatted HTML.
-   **Persistent Memory:** Each code review is saved to Cloudflare KV, demonstrating the use of memory and state.
-   **Built Entirely on Cloudflare:** The project is serverless and runs entirely on the Cloudflare developer platform.

## Tech Stack & Architecture

This application is composed of two main parts: a frontend hosted on Cloudflare Pages and a serverless backend API running on Cloudflare Workers.

### How it Works

1.  **Frontend (Cloudflare Pages):** The user interacts with the HTML/CSS/JS interface and submits their code.
2.  **Backend (Cloudflare Worker):** The Worker receives the `POST` request from the frontend. It handles CORS preflight checks and validates the request.
3.  **AI Analysis (Workers AI):** The Worker invokes the Llama 3.3 model with a specialized prompt to analyze the code.
4.  **Memory (Cloudflare KV):** The Worker saves the code and the AI's analysis to a KV namespace.
5.  **Response:** The Worker sends the AI-generated review back to the frontend, which then parses the Markdown and displays it to the user.

### Technologies Used

-   **Frontend:** HTML5, CSS3, Vanilla JavaScript
-   **Backend:** Cloudflare Workers
-   **AI:** Cloudflare Workers AI (Llama 3.3)
-   **Storage:** Cloudflare KV
-   **Deployment:** Cloudflare Pages (for frontend) & Wrangler CLI (for backend)

## Running Instructions

The application is fully deployed and accessible at the **[Live Demo URL](https://cf-ai-code-review.pages.dev/)**. Simply visit the link to use the application.
