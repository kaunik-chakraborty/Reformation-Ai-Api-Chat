# Reformation AI API Chat

This project, Reformation AI, is a versatile chat application where users can leverage their own API keys for various large language models (LLMs) such as OpenAI, Google, Anthropic, and OpenRouter. It provides a seamless interface for engaging in AI-powered conversations using multiple models.

## Features

- **Multi-Model API Key Support**: Users can add and manage multiple API keys for different LLMs (OpenAI, Google, Anthropic, OpenRouter).
- **AI Chat Functionality**: Engage in real-time conversations with AI using the configured models.
- **Prompt Improvement Feature**: An option to enhance and refine prompts for better AI interactions.
- **Chat Management**: Save, delete, and export chat threads to PDF.
- **Message Editing**: Rewrite, edit, and resend messages within the chat.
- **Secure Authentication**: Implemented Clerk authentication for secure user login and registration.
- **Theming**: Supports both dark and light modes for a personalized user experience.
- **Responsive Design**: Enjoy a seamless experience across various devices.
- **User-Friendly Interface**: Simple and intuitive design for quick and efficient interaction.
- **All API calls are made over HTTPS.**

## Getting Started

To get a copy of the project up and running on your local machine for development and testing purposes, follow these steps:

### Prerequisites

Make sure you have Node.js and npm (or yarn) installed.

```bash
node -v
npm -v
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/reformation-ai/reformation-ai-api-chat.git
cd reformation-ai-api-chat
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables for Clerk authentication:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/chat
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/chat
```

You can obtain these keys by signing up at [Clerk.dev](https://clerk.dev/) and creating a new application.

### Running the Application

```bash
npm run dev
# or
yarn dev
```

The application will be accessible at `http://localhost:3000`.

## Project Structure

- `src/app`: Contains the main application pages and layout.
- `src/components`: Reusable UI components.
- `src/hooks`: Custom React hooks for various functionalities.
- `src/lib`: Utility functions and API integrations.
- `public`: Static assets like images.

## Built With

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Strongly typed JavaScript

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Link: [https://github.com/reformation-ai/reformation-ai-api-chat](https://github.com/reformation-ai/reformation-ai-api-chat)