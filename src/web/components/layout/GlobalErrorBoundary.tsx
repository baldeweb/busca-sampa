import React from "react";

type GlobalErrorBoundaryState = {
  hasError: boolean;
};

export class GlobalErrorBoundary extends React.Component<React.PropsWithChildren, GlobalErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch() {
    // Estratégia:
    // 1) Na primeira vez que um erro global acontece, recarrega a página.
    // 2) Se acontecer de novo (nova montagem), redireciona para a home.
    // 3) A partir daí, mostra um fallback simples para evitar loop infinito.
    if (typeof window !== "undefined") {
      try {
        const currentPath = window.location.pathname + window.location.search + window.location.hash;
        const rawCount = window.sessionStorage.getItem("global_error_count");
        const count = rawCount ? parseInt(rawCount, 10) || 0 : 0;
        const nextCount = count + 1;
        window.sessionStorage.setItem("global_error_count", String(nextCount));
        window.sessionStorage.setItem("global_error_last_path", currentPath);

        if (nextCount === 1) {
          window.location.reload();
          return;
        }

        if (nextCount === 2 && currentPath !== "/") {
          window.location.href = "/";
          return;
        }
      } catch {
        // ignore storage errors and just fall back to local state
      }
    }

    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      if (typeof window !== "undefined") {
        const handleGoHome = () => {
          window.location.href = "/";
        };

        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-bs-bg text-white p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Algo deu errado :(</h1>
            <p className="mb-6 max-w-md">
              Tivemos um erro ao carregar esta página. Tente voltar para a tela inicial.
            </p>
            <button
              type="button"
              onClick={handleGoHome}
              className="px-4 py-2 rounded-md bg-bs-red text-white font-semibold"
            >
              Ir para a home
            </button>
          </div>
        );
      }

      return null;
    }

    return this.props.children as React.ReactElement;
  }
}
