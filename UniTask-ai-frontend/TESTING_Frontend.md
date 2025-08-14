# UniTask AI - Frontend Testing Strategy & Overview

To ensure the software quality of the UniTask AI frontend application, we have established a comprehensive testing strategy. This document aims to detail our testing methodologies, the tools we use, and the scope of our test coverage.

## 1. Tooling & Tech Stack

To achieve efficient and reliable testing, we have adopted the following industry-standard tools:

* **Vitest**: A modern, high-performance testing framework based on Vite. Its deep integration with our development environment provides a rapid feedback loop.
* **React Testing Library (RTL)**: We use this library for component testing. RTL promotes a user-centric testing philosophy, enabling us to write more resilient test cases that are closer to real-world user scenarios.
* **jsdom**: A pure JavaScript implementation of browser APIs that runs in Node.js. It provides a lightweight, simulated browser environment for our tests, significantly increasing execution speed.
* **`vi.mock`**: A built-in module mocking feature from Vitest. In our tests, we use this to create mocks for the backend API, thereby decoupling the frontend tests from external services and ensuring test independence and stability.

## 2. Testing Methodology

Our testing strategy consists of two primary layers: integration testing and unit testing.

### 2.1 Integration Testing

Integration testing is the cornerstone of our testing system, focusing on verifying the correctness of functional modules or entire pages composed of multiple components.

* **Test Scope**: Primarily covers all pages and components for both the student and tutor workspaces.
* **Test Method**: We simulate complete user workflows, covering the following scenarios:
    1.  Verifying the UI presentation in different states, such as data loading, successful load, and load failure.
    2.  Verifying that user interactions (e.g., clicks, form submissions) trigger the correct behaviors and state updates.
    3.  Verifying the data flow between components and the (mocked) API is correct.
* **Core Strategy**: This approach allows us to cover most core business processes with a high return on investment, ensuring the stability of the application's main features.

### 2.2 Unit Testing

Unit testing is used to verify the logical correctness of the smallest testable units in the application, such as a single component or function.

* **Test Scope**: Key shared components with complex internal logic.
* **Practical Example**: The `src/components/ProtectedRoute.jsx` component is responsible for the application's routing and permission control, making its logic critically important. Therefore, we have written isolated unit tests (`ProtectedRoute.test.jsx`) for it, precisely verifying the redirection logic under various conditions such as **unauthenticated, authenticated but with a mismatched role, and authenticated with the correct role**, thus ensuring the security of the application's routing system.

## 3. API Mocking Strategy

In all our automated frontend tests, we do not make real requests to the backend API. This strategy is based on the following principles:

1.  **Speed**: Avoids network latency to achieve instant test feedback.
2.  **Stability**: Eliminates test interruptions caused by backend service or network issues, ensuring consistent test results.
3.  **Isolation**: Allows frontend testing to be conducted independently of the backend environment, focusing solely on validating frontend logic.

We use the `vi.mock` feature to create a controllable mock `api` object. In our tests, we can precisely define its behavior, simulating successful responses or various failure scenarios to comprehensively validate the robustness of our frontend components.

## 4. How to Run Tests

From the project's root directory, execute the following command to run all frontend tests:

```bash
npm test