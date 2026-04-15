type DashBoardHeaderProps = {
    isLoading: boolean;
    onRefresh: () => void;
}

export function DashboardHeader({ isLoading, onRefresh }: DashBoardHeaderProps) {

    return (
        <>
            <header className="cabecalho">
                <div>
                    <h1>Dashboard de Investimentos</h1>
                    <p className="sobretitulo">
                        Cadastre fundos, registre os aportes e resgates e acompanhe o saldo da carteira em tempo real
                    </p>
                </div>

                <button
                    className="atualizar"
                    type="button"
                    onClick={onRefresh}
                    disabled={isLoading}
                >
                    {isLoading ? 'Atualizando...' : 'Atualizar dados'}
                </button>
            </header>
        </>
    )
}