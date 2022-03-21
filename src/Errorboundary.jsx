import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: "", errorInfo: "" };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    console.log("ERROR", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI

      return (
        <div>
          <h2>Something went wrong</h2>
          <p>
            Try contacting developer{" "}
            <a href="mailto:shubhamv8527@gmail.com">here</a> or open bug request{" "}
            <a
              href="https://github.com/shubhamV123/outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
          </p>
          <details style={{ wordBreak: "break-word" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
