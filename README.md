# Harbour.io

## Overview

Harbour is a holistic preventive health platform that aims to change how healthcare is done. Instead of expensive hospital bills, pills after pills, and just generally feeling awful, we want to help you stop yourself from falling sick in the first place. We are looking to deliver end-to-end care, spanning telehealth consultations and diagnosis, to day-to-day monitoring of diets and exercise, to give you and your caregivers the insight you need to truly target your self-care.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Before you begin, ensure you have the following tools installed on your machine:
- [Yarn](https://yarnpkg.com/) - Yarn is a fast, reliable, and secure dependency management tool.

You can check if you have Node and Yarn installed by running the following commands in your terminal:

```bash
yarn -v
```

### Installation

First, clone the Harbour repository to your local machine using Git:

```bash
git clone https://github.com/your-username/harbour.io.git
cd harbour.io
```

Install the project dependencies with Yarn:

```bash
yarn
```

### Running the Project

#### Development Environment

To run the project in a development environment with hot reloading:

```bash
yarn dev
```

This command will start a local development server. You can now access the Harbour platform by navigating to `http://localhost:3000` in your web browser.

#### Production Environment

To run the project in a production environment:

1. Build the project:

```bash
yarn build
```

This command prepares the project for production by optimizing and minifying the code.

2. Start the project:

```bash
yarn start
```

This command serves the production build of the app. Ensure your production environment is properly set up to serve the app to your users.