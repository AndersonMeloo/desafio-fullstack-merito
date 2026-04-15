export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return 'Erro inesperado ao processar a operação. Por favor, tente novamente.';
}